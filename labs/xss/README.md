## Cross-site Scripting (XSS Attack)

### Requirements 

In this lab, we will work on a social network website. An attacker, who is also a user on this website, injects a javascript into its profile, and when a victim visits the attacker's profile page, the injected javascript executes and the attacker gets added to the victim's friend list.

### Setup

Only one VM is sufficient. Source code for the social network website is provided and the website contains the following users:

|  Username |  Password   |  Role    |
|-----------|-------------|----------|
|  Alice    |  password1  | victim   |
|  Bob      |  password2  | attacker |
|  Samy     |  password3  |          |
|  Charlie  |  password4  |          |
|  Dana     |  password5  |          |

### Steps

1. install node:

```console
$ sudo apt install nodejs
$ sudo apt install npm
$ npm install ejs	// pay attention here, this ejs is a new package which is unique to this lab.
$ npm config set strict-ssl false
$ npm install express
$ npm install cookie-parser
$ npm install body-parser
```

2. set up the social network website:

```console
$ mkdir xss
$ cd xss/
$ wget http://ns.cs.rpi.edu/labs/xss/server.js
$ wget http://ns.cs.rpi.edu/labs/xss/index.ejs
$ wget http://ns.cs.rpi.edu/labs/xss/login.ejs
$ wget http://ns.cs.rpi.edu/labs/xss/profile.ejs
$ wget http://ns.cs.rpi.edu/labs/xss/edit-profile.ejs
```

- start the social network webserver:
```console
$ node server.js
```

3. open two browser tabs: one in normal mode, the other in **private windows** mode. In both of them, access the web server: type localhost:3000. In one tab, login as alice, in the other tab, login as bob.

![alt text](images/lab-xss-alice-profile.png "Lab xss alice profile")
![alt text](images/lab-xss-bob-profile.png "Lab xss bob profile")

4. Bob adds this script into his profile:

```console
<script> fetch('/add-friend/2'); </script>
``` 

Please refer to these screenshots to make sure you are adding the right content into Bob's profile:

![alt text](images/lab-xss-bob-inject-p1.png "Lab xss attacker injecting script")
![alt text](images/lab-xss-bob-inject-p2.png "Lab xss attacker injecting script")

access the website from the browser: open a new tab (make sure the banking site tab is still open), type localhost:8000 and enter, you should see this:

![alt text](images/lab-csrf-attacker-site.png "Lab csrf attacker")

7. refresh the banking page, if the attack is successful, jessica's account balance should have less money now.

![alt text](images/lab-csrf-attack-success.png "Lab csrf attack success")

As can be seen from the above screenshot, the attack is successful, and this concludes the lab.

### References:

CS253 Web Security – course created and taught by Feross Aboukhadijeh at Stanford University.
