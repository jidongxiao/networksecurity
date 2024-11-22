const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); // For session management
const app = express();
const port = 3000;

// Simulate a simple in-memory database
let users = [
    { id: 1, name: 'Alice', password: 'password1', friends: [], about: 'Loves reading books' },
    { id: 2, name: 'Bob', password: 'password2', friends: [], about: 'Hello, I am Bob. I love coding!' },
    { id: 3, name: 'Samy', password: 'password3', friends: [], about: '' },
    { id: 4, name: 'Charlie', password: 'password4', friends: [], about: '' },
    { id: 5, name: 'Dana', password: 'password5', friends: [], about: '' }
];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'xss-demo-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: Use 'secure: true' in production with HTTPS
}));
app.set('view engine', 'ejs');

// Set the views folder to the same directory as server.js
app.set('views', __dirname);
app.use(express.static('public'));

// Middleware to check login
function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        req.session.userId = user.id;
        res.redirect(`/user/${user.id}`);
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// User Profile (requires login)
app.get('/user/:userId', requireLogin, (req, res) => {
    // Get the userId from the URL parameter
    const userId = req.params.userId;
    
    // Find the user from the "users" array (or your database)
    const otherUser = users.find(u => u.id === parseInt(userId));
    
    // Get the current user from the session
    const currentUser = users.find(u => u.id === req.session.userId);
    
    if (!otherUser) {
        return res.status(404).send('User not found');
    }

    // Render the profile page with the current user and the user being viewed
    res.render('profile', {
        currentUser: currentUser, // Pass the currentUser to the view
        otherUser: otherUser,               // Pass the user being viewed to the view
	users: users,
    });
});

// Add Friend (Vulnerable to XSS)
app.get('/add-friend/:friendId', (req, res) => {
    const friendId = parseInt(req.params.friendId);  // If friend is added using URL with ID
    const userId = req.session.userId;

    // Find user and friend by IDs
    const user = users.find(u => u.id === userId);
    const friend = users.find(u => u.id === friendId);

    if (user && friend && !user.friends.includes(friendId)) {
        user.friends.push(friendId); // Add friend to current user's friend list
        res.send('Friend added successfully');
    } else {
        res.send('Error adding friend');
    }
});

app.post('/add-friend-by-name', (req, res) => {
    const { friendName } = req.body;
    const userId = req.session.userId;

    // Find the friend by name
    const user = users.find(u => u.id === userId);
    const friend = users.find(u => u.name.toLowerCase() === friendName.toLowerCase());

    if (friend && user && !user.friends.includes(friend.id)) {
        user.friends.push(friend.id);  // Add friend to current user's friend list
        res.send({ success: true, message: 'Friend added successfully' });
    } else {
        res.send({ success: false, message: 'Error adding friend or friend not found' });
    }
});

app.get('/remove-friend', (req, res) => {
    // Get the current user from the session
    const currentUser = users.find(u => u.id === req.session.userId);
    const friendId = parseInt(req.query.friendId, 10);

    if (!currentUser) {
        // If currentUser is not defined, send an error response
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }
    // Check if friendId is valid
    if (isNaN(friendId)) {
        return res.status(400).json({ success: false, message: 'Invalid friend ID' });
    }
    // Find the index of the friend to be removed in the user's friends array
    const friendIndex = currentUser.friends.indexOf(friendId);

    if (friendIndex === -1) {
        // Friend not found in the list
        return res.json({ success: false, message: 'Friend not found' });
    }

    // Remove the friend from the array
    currentUser.friends.splice(friendIndex, 1);

    // Save the updated friends list (for example, saving to the database or in-memory array)
    // This depends on how your application stores user data.
    // Here, we are assuming you're saving it back to the "users" array.
    const user = users.find(u => u.id === currentUser.id);
    if (user) {
        user.friends = currentUser.friends;
    }

    // Respond with a success message
    res.json({ success: true, message: 'Friend removed successfully' });
});

app.get('/edit-profile', (req, res) => {
  // Assuming `currentUser` is the logged-in user
  const currentUser = users.find(u => u.id === req.session.userId);  // Find user by session or ID
  res.render('edit-profile', { user: currentUser });
});

app.post('/save-profile', (req, res) => {
  // Assuming `currentUser` is the logged-in user
  const userId = req.session.userId;  // Get the logged-in user's ID from session or request
  const updatedAbout = req.body.about;

  // Find the user and update their profile
  const user = users.find(u => u.id === userId);
  if (user) {
    user.about = updatedAbout;  // Update profile
    res.redirect(`/user/${userId}`);  // Redirect to the user's profile page
  } else {
    res.status(404).send('User not found');
  }

});

// Home Page (list of users)
app.get('/', requireLogin, (req, res) => {
    res.render('index', { users });
});

// Start the server
app.listen(port, () => {
    console.log(`Social Network app running at http://localhost:${port}`);
});

