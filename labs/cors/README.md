# Cross-Origin Resource Sharing (CORS) Vulnerability Lab

## Overview

In this lab, you will demonstrate a CORS vulnerability caused by insecure origin reflection.

A simulated online banking website allows users to log in and view their account balances. An attacker-controlled website attempts to retrieve the victim's account information using JavaScript.

The banking server contains an insecure CORS configuration: it copies the request's `Origin` header directly into the `Access-Control-Allow-Origin` response header and allows credentials.

As a result, when a logged-in victim visits the attacker's website, the attacker's JavaScript can retrieve and read the victim's account information using the victim's authenticated session.

You will also modify the banking server to fix the vulnerability and observe how the browser enforces the corrected CORS policy.

## Requirements

- One Ubuntu VM is sufficient.
- Node.js and npm.
- A web browser with Developer Tools.

## Lab Architecture

The lab uses two web servers running on different ports:

| Website | Address |
|---|---|
| Banking website | http://localhost:4000 |
| Attacker website | http://localhost:8000 |

Although both websites use `localhost`, their different ports make them different origins.

## Setup

### 1. Install Node.js and dependencies

```console
$ sudo apt install nodejs npm
```

### 2. Set up the banking directory

```console
$ mkdir banking
$ cd banking
```

Save the following files in the `banking` directory:

- [index.html](banking/index.html)
- [server.js](banking/server.js)

Install the required Node.js packages:

```console
$ npm install express
$ npm install cookie-parser
$ npm install body-parser
```

Start the banking web server:

```console
$ node server.js
```

### 3. Log in to the banking website

Open a browser and visit:

http://localhost:4000

Log in using the following credentials:

- Username: `jessica`
- Password: `50505`

After logging in, Jessica's account balance should be displayed as $10,000.

Keep this browser tab open.

### 4. Set up the attacker directory

Open another terminal and create the attacker directory:

```console
$ mkdir attacker
$ cd attacker
```

Save the following file in the `attacker` directory:

- [index.html](attacker/index.html)
- [cat.gif](attacker/cat.gif)

Start the attacker web server:

```console
$ python3 -m http.server 8000
```

### 5. Visit the attacker's website

Open a new browser tab and visit:

http://localhost:8000

You should see the attacker's website.

Click the **View your surprise!** button.

If the attack is successful, the attacker's website will display Jessica's username and account balance.

The attacker has successfully retrieved sensitive information from the banking website without knowing Jessica's username, password, or session cookie.

## Understanding the Attack

Open the browser's Developer Tools and select the Network tab.

Find the request to:

```text
http://localhost:4000/api/account
```

Examine the request and response headers.

**Request headers:**

```http
Origin: http://localhost:8000
Cookie: sessionId=...
```

**Response headers:**

```http
Access-Control-Allow-Origin: http://localhost:8000
Access-Control-Allow-Credentials: true
Content-Type: application/json
```

**Response body:**

```json
{
    "username": "jessica",
    "balance": 10000
}
```

The banking server blindly reflects the supplied `Origin` value in its `Access-Control-Allow-Origin` response header.

Because the server also sets `Access-Control-Allow-Credentials: true`, the browser permits JavaScript running on the attacker's website to read the authenticated response.

Notice that there is no `OPTIONS` preflight request in this example. The attacker uses a simple cross-origin `GET` request, so the browser sends the actual request directly.

The `credentials: 'include'` option in the attacker's `fetch()` call tells the browser to include the victim's session cookie.

The attacker does not need to steal or read the session cookie. The victim's browser sends it automatically.

## Fixing the Vulnerability

The vulnerability occurs because the banking server trusts arbitrary origins.

Modify `banking/server.js` to allow only explicitly trusted origins.

For example, replace the insecure origin-reflection logic with the following allowlist:

```javascript
const ALLOWED_ORIGINS = [
    'http://localhost:4000'
];

app.get('/api/account', (req, res) => {
    const origin = req.headers.origin;

    if (ALLOWED_ORIGINS.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Vary', 'Origin');
    }

    // Keep the existing authentication and account lookup code here.
});
```

Restart the banking server and revisit the attacker's website.

Click **View your surprise!** again.

This time, the attack should fail. The request may still reach the banking server, but the browser will not allow JavaScript running on `http://localhost:8000` to read the response because that origin is not authorized.

## References

- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [OWASP: CORS Misconfiguration](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny)
