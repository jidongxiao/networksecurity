# Understanding DOM-Based XSS and Why It's a Client-Side Vulnerability

## What is DOM-Based XSS?
DOM-Based XSS (Cross-Site Scripting) occurs when a web application’s JavaScript directly processes untrusted input from the browser (such as URL parameters, hash fragments, or cookies) and updates the DOM without proper validation or sanitization. This happens entirely on the **client-side**, without involving the server in processing the malicious payload.

---

## Where is the Vulnerability?

### Server-Side vs. Client-Side Execution:
- **Server-Side Code**: Runs on the server and generates dynamic HTML, CSS, or JavaScript (e.g., with PHP, Node.js, or Python). Vulnerabilities like **reflected** or **stored XSS** happen here when malicious input is processed or stored by the server.
- **Client-Side Code**: Runs in the user's browser. Vulnerabilities like DOM-based XSS occur when client-side JavaScript manipulates the DOM using untrusted data.

In DOM-Based XSS, the **server does not process or even see the malicious input**. The vulnerability resides in JavaScript logic running in the browser.

---

## Why Is It Called Client-Side Code?

### Role of the Server:
- The server **sends the static HTML file and JavaScript** to the client.
- The **execution happens entirely in the user’s browser**. The server does not process or render the malicious input.

### Role of the Client:
- The browser executes JavaScript and dynamically modifies the DOM. If the JavaScript contains insecure logic (e.g., inserting unescaped input directly into the DOM), it creates the vulnerability.

---

## Example: DOM-Based XSS

### Code Example:
Here’s a simple example of vulnerable JavaScript in a webpage:

```html
<!DOCTYPE html>
<html>
<body>
    <h1>Welcome</h1>
    <p id="msg"></p>
    <script>
        // JavaScript running in the user's browser
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');
        document.getElementById('msg').innerHTML = `Hello, ${name}`;
    </script>
</body>
</html>
```

## Steps to Exploit

1. The server hosts this static webpage and serves it to users.
2. A malicious user sends the following URL to a victim:
   ```plaintext
   http://example.com/?name=<script>alert('XSS')</script>
   ```
3. The browser receives the URL, executes the JavaScript, and dynamically updates the DOM with:

   ```html
   <p id="msg">Hello, <script>alert('XSS')</script></p>
   ```

The injected `<script>` executes in the victim’s browser, displaying an alert box.

---

## Key Difference from Server-Side XSS

- In **Server-Side XSS** (reflected or stored), the malicious payload is processed and/or stored by the server, which sends it back in the response to the client.
- In **DOM-Based XSS**, the server is not involved in processing or storing the malicious input. The vulnerable JavaScript in the browser creates the issue.

---

## Why This is a Client-Side Vulnerability

Although the HTML and JavaScript originate from the server, the vulnerable code executes in the **user’s browser**, and the malicious input never reaches the server. The manipulation happens entirely in the browser, making it a **client-side vulnerability**.

---

## How to Mitigate DOM-Based XSS

- **Validate Input**: Always validate and sanitize user input on the client and server.
- **Escape Dangerous Characters**: Use libraries or functions to escape characters like `<`, `>`, `&`, etc., before inserting input into the DOM.
- **Avoid `innerHTML`**: Use safer methods like `textContent` or `setAttribute` to prevent injecting raw HTML.
- **Use Content Security Policy (CSP)**: Add a CSP header to restrict the execution of unauthorized scripts.

---

### Example of Escaping User Input in JavaScript:

```javascript
const escapeHtml = (str) => 
    str.replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#039;');

// Use the escaped input
document.getElementById('msg').innerHTML = `Hello, ${escapeHtml(name)}`;
```

## Summary

While the HTML and JavaScript files are served by the server, the vulnerability in DOM-Based XSS arises because JavaScript running in the browser processes and manipulates untrusted input without validation. This makes DOM-Based XSS a client-side vulnerability.
