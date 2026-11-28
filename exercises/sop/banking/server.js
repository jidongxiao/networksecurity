const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Server configuration.
const HOST = '0.0.0.0';
const PORT = 4000;

// Change this when deploying the lab on another domain.
const ATTACKER_ORIGIN = 'http://localhost:8000';

app.use(express.urlencoded({ extended: false }));

const USERS = {
    jessica: {
        password: '50505',
        balance: 10000
    }
};

const SESSIONS = {};


// Retrieve the authenticated user.
function getUser(req) {
    const match = req.headers.cookie
        ? req.headers.cookie.match(/(?:^|;\s*)sessionId=([^;]+)/)
        : null;

    if (!match) {
        return null;
    }

    return SESSIONS[match[1]] || null;
}


// Escape user-provided text before inserting it into HTML.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return entities[character];
    });
}


// Log incoming requests.
app.use((req, res, next) => {
    console.log(
        `${req.method} ${req.url} | ` +
        `Origin: ${req.headers.origin || '(none)'} | ` +
        `Cookie: ${req.headers.cookie ? 'present' : '(none)'}`
    );

    next();
});


// Banking homepage.
app.get('/', (req, res) => {
    const username = getUser(req);

    if (!username) {
        return res.sendFile(path.join(__dirname, 'index.html'));
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Online Banking</title>
        </head>
        <body>
            <h1>Online Banking</h1>

            <h2>Welcome, ${escapeHTML(username)}!</h2>

            <p>Your account balance:
               $${USERS[username].balance}</p>

            <p>
                <a href="/private">View private account page</a>
            </p>

            <p>
                <a href="/logout">Logout</a>
            </p>

            <script>
                localStorage.setItem(
                    'bankSecret',
                    'BANK-PRIVATE-DATA-12345'
                );
            </script>
        </body>
        </html>
    `);
});


// Login.
app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = USERS[username];

    if (!user || user.password !== req.body.password) {
        return res.status(401).send('Invalid username or password.');
    }

    const sessionId = crypto.randomBytes(16).toString('hex');

    SESSIONS[sessionId] = username;

    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
    });

    console.log(`User ${username} logged in.`);

    res.redirect('/');
});


// Logout.
app.get('/logout', (req, res) => {
    const match = req.headers.cookie
        ? req.headers.cookie.match(/(?:^|;\s*)sessionId=([^;]+)/)
        : null;

    if (match) {
        delete SESSIONS[match[1]];
    }

    res.clearCookie('sessionId', { path: '/' });

    res.redirect('/');
});


// Private page for iframe and postMessage experiments.
app.get('/private', (req, res) => {
    const username = getUser(req);

    if (!username) {
        return res.status(401).send('Please log in first.');
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Private Banking Information</title>
        </head>
        <body>
            <h1>Private Banking Information</h1>

            <p>Username: ${escapeHTML(username)}</p>

            <p>Account Balance:
               $${USERS[username].balance}</p>

            <p>Secret: BANK-PRIVATE-DATA-12345</p>

            <p id="message">No messages received.</p>

            <script>
                window.addEventListener('message', event => {
                    if (event.origin !== ${JSON.stringify(ATTACKER_ORIGIN)}) {
                        return;
                    }

                    document.getElementById('message').textContent =
                        'Received message: ' + event.data;
                });
            </script>
        </body>
        </html>
    `);
});


// Account API.
app.get('/api/account', (req, res) => {
    const username = getUser(req);

    if (!username) {
        return res.status(401).json({
            error: 'Not authenticated'
        });
    }

    res.json({
        username: username,
        balance: USERS[username].balance
    });
});


// Cross-origin JavaScript resource.
app.get('/resources/target.js', (req, res) => {
    res.type('application/javascript').send(`
        console.log('Banking JavaScript executed!');
        window.bankScriptExecuted = true;
    `);
});


// Cross-origin CSS resource.
app.get('/resources/target.css', (req, res) => {
    res.type('text/css').send(`
        .bank-style {
            background-color: lightblue;
            border: 3px solid blue;
            padding: 20px;
        }
    `);
});


// Cross-origin image.
app.get('/images/vault.svg', (req, res) => {
    res.type('image/svg+xml').send(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="200" height="120">
            <rect width="200" height="120" fill="#2874a6"/>
            <circle cx="100" cy="60" r="35"
                    fill="#f4d03f"/>
            <text x="100" y="66"
                  font-size="16"
                  text-anchor="middle"
                  fill="black">BANK</text>
        </svg>
    `);
});


// Cross-origin form submission.
app.post('/submit', (req, res) => {
    const message = escapeHTML(req.body.message || '');

    console.log('Received form submission:', req.body);

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Form Submission Result</title>
        </head>
        <body>
            <h1>Banking Server</h1>
            <p>Your form was successfully received.</p>
            <p>Message: ${message}</p>
        </body>
        </html>
    `);
});


// Start the server.
app.listen(PORT, HOST, () => {
    console.log(`Banking server listening on port ${PORT}`);
    console.log(`Expected attacker origin: ${ATTACKER_ORIGIN}`);
    console.log('CORS is not enabled.');
});
