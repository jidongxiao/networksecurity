const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));

// Users with specific passwords
const users = {
  attacker: '1234',  // Attacker's password
  victim: 'password' // Victim's password
};

// Balances for each user
const balances = {
  attacker: 500, // Attacker's balance
  victim: 100    // Victim's balance
};

// Middleware to handle session fixation (for demonstration only)
app.use((req, res, next) => {
  if (req.query.sessionid) {
    req.sessionID = req.query.sessionid; // Setting session ID manually (vulnerable behavior)
  }
  next();
});

// Redirect root URL to login page
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => {
  if (req.session.authenticated) {
    res.send(`
      Welcome back, ${req.session.user}! 
      <br><a href="/account">View Account</a>
    `);
  } else {
    res.send(`
      <form method="POST" action="/login">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <button type="submit">Login</button>
      </form>
    `);
  }
});

// Handle login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    // req.session.regenerate((err) => {
    //  if (err) return res.send('Error regenerating session.');
      req.session.authenticated = true;
      req.session.user = username;
      res.send(`
        Welcome, ${req.session.user}! 
        Your current Session ID is: ${req.sessionID}
        <br><a href="/account">View Account</a>
      `);
    // });
  } else {
    res.send('Invalid username or password.');
  }
});

// Account page (formerly Dashboard)
app.get('/account', (req, res) => {
  if (req.session.authenticated) {
    const user = req.session.user;
    const balance = balances[user];
    res.send(`
      Welcome, ${user}! 
      Your balance is $${balance}.
    `);
  } else {
    res.send('Access denied. Please <a href="/login">log in</a>.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

