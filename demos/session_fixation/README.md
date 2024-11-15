## Session Fixation Attack

The following is the usernames and passwords.

|  Username |  Password  | Balance | Role     |
|-----------|------------|---------|----------|
|  attacker |  1234      | $500    | attacker |
|  victim   |  password  | $100    | victim   |


Steps:

1. Install the web server.

```console
$ sudo apt install nodejs
$ sudo apt install npm
$ npm config set strict-ssl false
$ npm install express express-session
```

2. Run the web server:

Open one terminal window and run:

```console
$ node server.js
```

3. In Firefox, visit http://localhost:3000, login as attacker and view the sessionid.

4. In Firefox, open a private window and visit http://localhost:3000/login?sessionid=... (append the attacker's session id here), login as victim.

5. Now the attacker should be able to view the victim's account balance.
