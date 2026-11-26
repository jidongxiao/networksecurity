const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const randomBytes = require('crypto').randomBytes;

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

const USERS = {
    alice: 'password',
    jessica: '50505'
};

const BALANCES = {
    alice: 500,
    jessica: 10000
};

const SESSIONS = {}; // sessionId -> username

app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId;
    const username = SESSIONS[sessionId];

    if (username) {
        res.send(`
            <h1>Online Banking</h1>
            <p>Welcome, ${username}!</p>
            <p>Your account balance is $${BALANCES[username]}.</p>
            <p><a href="/logout">Logout</a></p>
        `);
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = USERS[username];

    if (password === req.body.password) {
        const sessionId = randomBytes(16).toString('hex');

        SESSIONS[sessionId] = username;

        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            sameSite: 'lax'
        });

        res.redirect('/');
    } else {
        res.send('Invalid username or password.');
    }
});

app.get('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;
    delete SESSIONS[sessionId];

    res.clearCookie('sessionId');
    res.redirect('/');
});

// Insecure CORS configuration: reflect any supplied Origin.
app.get('/api/account', (req, res) => {
    const origin = req.headers.origin;

    if (origin) {
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Vary', 'Origin');
    }

    const sessionId = req.cookies.sessionId;
    const username = SESSIONS[sessionId];

    if (!username) {
        return res.status(401).json({
            error: 'Not authenticated'
        });
    }

    const account = {
        username: username,
        balance: BALANCES[username]
    };

    console.log('Returning account information:', account);

    res.json(account);
});

app.listen(4000, () => {
    console.log('Banking server listening on port 4000');
});
