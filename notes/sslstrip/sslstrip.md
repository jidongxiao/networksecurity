# SSLstrip, HSTS, and HSTS Preloading

## Overview

This document provides an overview of SSLstrip attacks, HSTS (HTTP Strict Transport Security), and HSTS Preloading. These concepts are key to understanding some of the vulnerabilities and protections associated with HTTP and HTTPS communication.

---

## 1. SSLstrip

### What is SSLstrip?

SSLstrip is a type of **Man-in-the-Middle (MITM) attack** that downgrades HTTPS connections to unencrypted HTTP connections. The attack leverages the fact that while websites are accessed over HTTPS, the initial request (e.g., entering `example.com` in the browser) often defaults to HTTP. By intercepting this unencrypted request, an attacker can alter it to keep the communication as HTTP, stripping away the encryption provided by HTTPS.

### How SSLstrip Works

1. **Intercepting HTTP Requests**: The attacker places themselves between the client and the server, typically by setting up a rogue gateway or DNS spoofing.
2. **Downgrading HTTPS**: When the client tries to connect to a secure website, the attacker intercepts this HTTP connection and prevents the redirect to HTTPS.
3. **Relaying Data as HTTP**: The attacker forwards the HTTP data to the client, and any sensitive information (e.g., passwords) is sent without encryption.

### SSLstrip in Action

Suppose a user attempts to connect to `https://bank.com`. The attacker intercepts the HTTP request and rewrites it to use `http://bank.com`, keeping the connection unencrypted. The client is unaware that the connection is not secure, as SSLstrip modifies the link without displaying the security warnings typically associated with HTTPS.

### Mitigation of SSLstrip Attacks

SSLstrip attacks can be mitigated by implementing HTTP Strict Transport Security (HSTS) policies, as discussed in the next section.

---

## 2. HTTP Strict Transport Security (HSTS)

### What is HSTS?

HSTS, or **HTTP Strict Transport Security**, is a web security policy mechanism that allows websites to **enforce HTTPS** connections. It was introduced to protect against SSLstrip attacks by ensuring that web browsers only connect to sites using HTTPS, even if the initial request is made via HTTP.

### How HSTS Works

1. **Initial HTTPS Connection**: The client initially connects to the website via HTTPS.
2. **HSTS Header**: The server responds with an HSTS header, instructing the browser to automatically upgrade all future HTTP requests to HTTPS for that domain.
3. **Enforced HTTPS Connections**: Once an HSTS policy is applied, the browser will prevent insecure (HTTP) connections to the domain, effectively preventing SSLstrip attacks.

### HSTS Header Example

An example HSTS response header:
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

- `max-age=31536000`: Specifies the duration (in seconds) for which the browser should enforce HTTPS. In this example, 31,536,000 seconds is equivalent to one year.
- `includeSubDomains`: Optional directive indicating that HSTS should apply to all subdomains as well.

### Check HSTS Header Using curl

```console
$ curl -I https://www.usps.com | grep -i strict-transport-security
```

### Limitations of HSTS

HSTS is effective once a site has been visited securely (over HTTPS). However, it does not prevent an SSLstrip attack on the **initial connection** if a user first visits the site over HTTP.

---

## 3. HSTS Preloading

### What is HSTS Preloading?

**HSTS Preloading** addresses the initial connection vulnerability by including a list of HSTS-enabled domains directly in browsers. When a site is added to the preload list, it automatically forces HTTPS connections, even on the very first visit, without needing to receive an HSTS header.

### How to Enable HSTS Preloading

1. **Implement HSTS with a Long max-age**: The `max-age` should be set to at least one year.
2. **Enable Preloading Directive**: Add the `preload` directive to the HSTS header:
   ```http
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   ```

3. **Submit to the HSTS Preload List**: Submit the site for inclusion in the [HSTS Preload List](https://hstspreload.org/). Once approved, the domain is added to the preload list used by major browsers.

### Benefits of HSTS Preloading

- **Immediate HTTPS Enforcement**: Ensures HTTPS-only connections from the very first visit, effectively preventing SSLstrip attacks.
- **Enhanced Security**: HSTS Preloading extends the benefits of HSTS by providing a secure connection even for users who have never visited the site before.

### Limitations of HSTS Preloading

- **Difficult to Remove**: Once a site is added to the HSTS Preload List, it can be challenging to remove, which can be problematic if a domain changes ownership or no longer requires HSTS.
- **Subdomain Requirements**: All subdomains must support HTTPS and should also enforce HSTS to qualify for preloading.

---

## Summary

| Concept             | Description                                                                                                           |
|---------------------|-----------------------------------------------------------------------------------------------------------------------|
| **SSLstrip**        | An attack that downgrades HTTPS connections to HTTP, allowing attackers to intercept data without encryption.        |
| **HSTS**            | A security policy that forces HTTPS connections after the initial visit, protecting against SSLstrip in future visits. |
| **HSTS Preloading** | A preloaded list in browsers that enforces HTTPS-only connections on the first visit, further securing sites from SSLstrip attacks. |

### Additional Resources

- [HSTS Preload Submission Site](https://hstspreload.org/)

By implementing HSTS and HSTS Preloading, website administrators can significantly improve the security of their websites, safeguarding against attacks like SSLstrip.
