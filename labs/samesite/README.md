# Understanding the SameSite Cookie Attribute

### Requirements

In this lab, we will examine the behavior of the `SameSite` attribute in cookies. We will use two websites: an online banking website and an attacker's website. The victim is logged into the online banking website while visiting the attacker's website in another browser tab.

We will experiment with two values of the `SameSite` attribute: `Strict` and `Lax`. We will observe how the browser handles cookies when the attacker initiates cross-site requests to the banking website.

The goal is to understand the difference between `SameSite=Strict` and `SameSite=Lax`, and how these settings can help prevent CSRF attacks.

### Setup

Only one VM is sufficient.

### Steps

1. Install Node.js and npm if they are not already installed:

```console
$ sudo apt install nodejs
$ sudo apt install npm
$ npm config set strict-ssl false
$ npm install express@4.18.2 body-parser@1.20.2 cookie-parser@1.4.6
```

2. Set up the banking directory:

```console
$ mkdir banking
$ cd banking/
```

Save these 2 files in the banking folder:

[index.html](banking/index.html)

[server.js](banking/server.js)

The banking server supports two configurations: `SameSite=Strict` and `SameSite=Lax`. We can select the configuration when starting the server.

3. Configure the hostnames.

We need two different hostnames because different port numbers alone do not make two websites cross-site. Edit `/etc/hosts` and add the following entries:

```text
127.0.0.1 bank.test
127.0.0.1 attacker.example
```

4. Start the banking web server with `SameSite=Strict`:

```console
$ SAME_SITE=Strict node server.js
```

5. Access the banking website from the browser: type `http://bank.test:4000`, and you should see the login page.

6. Log in as Jessica, username: `jessica`, password: `50505`. You should see that Jessica's account balance is $10,000.

Open the browser's Developer Tools and inspect the `sessionId` cookie. Its SameSite attribute should be `Strict`.

7. Set up the attacker directory:

```console
$ mkdir attacker
$ cd attacker/
```

Save these 3 files in the attacker folder:

[index.html](attacker/index.html)

[cat.gif](attacker/cat.gif)

[attacker-frame.html](attacker/attacker-frame.html)

Start the attacker web server:

```console
$ python3 -m http.server 8000
```

8. Access the attacker website from the browser: open a new tab (make sure the banking website tab is still open), type `http://attacker.example:8000`, and enter.

The attacker website contains a hidden iframe that automatically submits a POST request to the banking website. The request attempts to transfer $1,000 from Jessica's account to Alice's account.

9. Open the browser's Developer Tools (F12), select the Network tab, and visit the attacker website again:

`http://attacker.example:8000`

The hidden iframe automatically submits a POST request to `/transfer`.

In the Network tab, find the POST request to `/transfer` and examine its Request Headers. Observe that the request does not contain the `Cookie: sessionId=...` header.

Since the cookie is configured with `SameSite=Strict`, the browser does not send it with this cross-site request. Consequently, the banking server cannot authenticate Jessica, and the transfer fails.

Return to the banking website and verify that Jessica's balance is still $10,000.

10. Now experiment with `SameSite=Lax`.

Stop the banking server by pressing Ctrl+C and restart it with the following command:

```console
$ SAME_SITE=Lax node server.js
```

Log in again as Jessica (username: `jessica`, password: `50505`). Remember that restarting the server resets its in-memory session database.

Open the browser's Developer Tools and select the Network tab. Visit the attacker website again and repeat the attack.

Find the POST request to `/transfer` and examine its Request Headers. Observe that the browser still does not send the session cookie. The transfer is blocked, just as it was with `SameSite=Strict`.

11. Finally, compare the behavior of `SameSite=Strict` and `SameSite=Lax` with cross-site top-level GET navigation.

While logged into the banking website with `SameSite=Lax`, visit the attacker website and click the link labeled "Visit our banking partner!"

This link initiates a cross-site top-level GET navigation to the banking website.

In the browser's Developer Tools, inspect the GET request to `/`. Observe that this time the request contains the `Cookie: sessionId=...` header. The browser sends the cookie because `SameSite=Lax` allows cookies in cross-site top-level safe navigations.

Now repeat the experiment with `SameSite=Strict`:

- Stop the banking server.
- Restart it using `SAME_SITE=Strict node server.js`.
- Log in again as Jessica.
- Visit the attacker website and click "Visit our banking partner!"
- Inspect the GET request to `/` in the Network tab.

Observe that the request does not contain the session cookie. Even though this is a top-level GET navigation, `SameSite=Strict` prevents the cookie from being sent because the navigation originates from another site.

The results can be summarized as follows:

| Cross-site request | SameSite=Strict | SameSite=Lax |
|---|---|---|
| Top-level GET navigation | Cookie not sent | Cookie sent |
| POST request from hidden iframe | Cookie not sent | Cookie not sent |

As we can see, both settings prevent the CSRF attack in our experiment. However, `SameSite=Lax` is more permissive because it allows cookies to be sent with cross-site top-level safe navigations, such as GET requests.

This concludes the lab.

### References

CS253 Web Security – course created and taught by Feross Aboukhadijeh at Stanford University.
