## Logic Error in Web Servers demo

Steps:

1. Run these commands to install the web server

```console
$ sudo apt update
$ sudo apt install nodejs npm -y
$ npm init -y
$ npm config set strict-ssl false
$ npm install express
```

2. Start the web server: go inside v1, or v2, or v3, and run this:

```console
$ node server.js
```

3. Then use Burp Suite to buy laptops, and see if you can succeed on each of these 3 servers.
