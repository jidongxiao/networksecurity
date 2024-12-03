# HTTP Parameter Pollution (HPP) Attack

## Overview

**HTTP Parameter Pollution (HPP)** is a web security exploit where attackers inject multiple instances of the same HTTP parameter in a single request. By polluting the parameter space, attackers aim to manipulate the application's behavior or bypass input validation mechanisms.

---

## How It Works

HTTP requests often include parameters, such as in the query string or POST data. In an HPP attack, an attacker sends multiple parameters with the same name, like:

`https://example.com/page?id=123&id=456`

Depending on how the server processes the parameters:
- Some frameworks use the **first value** (`id=123`).
- Others use the **last value** (`id=456`).
- Some may concatenate all values (`id=123,456` or `id=123&456`).

This inconsistency can lead to unexpected behavior or vulnerabilities in the application.

---

## Common Targets and Scenarios

### 1. Bypassing Input Validation
- **Example**: If `id=123` passes validation but `id=DROP TABLE users` is appended, the malicious payload might bypass server-side validation and execute.

### 2. Manipulating Application Logic
- **Example**: Injecting multiple `role=admin` parameters to elevate privileges.

### 3. Wreaking Havoc on Back-End Processing
- **Example**: Polluted parameters may disrupt APIs, SQL queries, or other processes that don't handle multiple values properly.

### 4. Security Filter Evasion
- **Example**: Bypassing web application firewalls (WAFs) that validate parameters individually but fail to account for duplicates.

### 5. Exploiting Third-Party APIs
- **Example**: Sending polluted parameters to third-party services that process input differently, potentially causing errors or leaks.

---

## Tools and Techniques

Attackers use various tools and methods to execute HPP attacks:

- **Web Proxies**: Tools like [Burp Suite](https://portswigger.net/burp) or [OWASP ZAP](https://owasp.org/www-project-zap/).
- **Custom Scripts**: Scripts crafted in Python or similar languages to automate sending duplicate parameters.
- **Browser Extensions**: Tamper tools or plugins to modify live HTTP requests.

---

## Prevention Techniques

To protect your application against HTTP Parameter Pollution:

### 1. Normalize Inputs
- Implement parameter normalization to handle duplicates consistently (e.g., always use the first or last value).

### 2. Validate Parameters
- Validate all parameters on the **server side**.
- Reject requests containing duplicate parameters unless explicitly required.

### 3. Sanitize Inputs
- Remove or reject polluted parameters during request preprocessing.

### 4. Strict API Contracts
- Define clear API contracts specifying expected parameters and enforce them rigorously.

### 5. Use a Web Application Firewall (WAF)
- Configure a WAF to detect and block HPP attacks.

### 6. Logging and Monitoring
- Log requests with multiple instances of the same parameter.
- Monitor logs for suspicious patterns.

---

## Example: Vulnerable Code

```php
<?php
// Vulnerable: Processes all instances of the 'id' parameter
$id = $_GET['id']; 
echo "ID is $id";
?>
```

### Exploitation

#### Request

`https://example.com/page?id=123&id=456`

#### Possible Output

`ID is 123,456`

---

## Conclusion

HTTP Parameter Pollution can lead to bypassing validation, logic manipulation, or unexpected behavior in web applications. By normalizing inputs, validating parameters, and employing security best practices, you can mitigate this risk and secure your application against HPP attacks.
