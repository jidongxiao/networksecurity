# HTTP Parameter Tampering Attack

## Overview

An **HTTP Parameter Tampering (HPT)** attack is a web security exploit where attackers manipulate parameters in HTTP requests to influence the behavior of a web application. By altering these parameters, attackers may bypass security mechanisms, gain unauthorized access, or exploit vulnerabilities in the application.

---

## How It Works

HTTP requests often include parameters that can be manipulated by an attacker. These parameters can appear in various locations:

1. **Query String**: Part of the URL (e.g., `https://example.com/page?id=123`).
2. **POST Data**: In the body of a POST request (e.g., `username=admin&password=123`).
3. **Cookies**: Sent in HTTP headers.
4. **Headers**: Custom or standard headers like `User-Agent` or `Referer`.

Attackers modify these parameters to exploit the application, often with malicious intent.

---

## Common Targets and Scenarios

### 1. Authentication and Authorization
- **Bypassing Access Controls**: Changing `isAdmin=false` to `isAdmin=true`.
- **Session Hijacking**: Logging in as another user by altering session tokens.

### 2. E-Commerce Price Manipulation
- **Changing Prices**: Modifying `price=100` to `price=1` in a shopping cart request.

### 3. Data Extraction
- **Unauthorized Data Access**: Altering `id=123` to `id=124` to view another user's data.

### 4. Logic Manipulation
- **Triggering Unintended Behavior**: Changing `quantity=1` to `quantity=1000` to exploit order processing.

### 5. SQL Injection
- **Database Exploits**: Injecting malicious input, such as modifying `id=123` to `id=123' OR '1'='1`.

---

## Tools and Techniques

Attackers often use the following tools and techniques to intercept and modify HTTP parameters:

- **Web Proxies**: Tools like [Burp Suite](https://portswigger.net/burp) or [OWASP ZAP](https://owasp.org/www-project-zap/) to inspect and manipulate HTTP traffic.
- **Browser Extensions**: Plugins like Tamper Data for live editing.
- **Custom Scripts**: Scripts written in languages like Python to automate parameter tampering.

---

## Prevention Techniques

To protect web applications against HTTP Parameter Tampering:

### 1. Input Validation
- Validate and sanitize all inputs on the **server side**.
- Reject unexpected or invalid values.

### 2. Parameter Integrity Checks
- Use server-side mechanisms to validate parameter values (e.g., recalculating totals or cross-checking with database records).

### 3. Authentication and Authorization
- Ensure users can only access or modify data they are authorized to interact with.
- Implement strong session management practices.

### 4. Use Secure Tokens
- Use cryptographic tokens (e.g., HMAC) to verify parameter integrity.

### 5. Avoid Client-Side Validation
- Perform all critical validation and checks on the **server**, as client-side validation can be bypassed.

### 6. Logging and Monitoring
- Log suspicious parameter changes for auditing.
- Implement rate-limiting to detect and block automated tampering attempts.

---

## Conclusion

HTTP Parameter Tampering is a serious threat to web applications. Implementing robust validation, secure token mechanisms, and proper logging can significantly mitigate the risk of these attacks.
