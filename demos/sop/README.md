## Same Origin Policy and Cross-Origin Resource Sharing

Steps:

1. Install the web server.

```console
$ cd node
$ sudo apt install nodejs-legacy
$ sudo apt install npm
$ npm config set strict-ssl false
$ npm install express
```

2. Run the web server:

Open one terminal window and run:

```console
$ node server1/server1.js
```

Meanwhile, open one terminal window and run:

```console
$ node server2/server2.js
```

3. In Firefox, open two tabs, one visits localhost:3000 (this visits server 1), the other visits localhost:4000 (this visits server 2).

4. In server2/server2.js, enable and disable CORS (cross origin resource sharing), via commenting and uncommenting this line:

```console
res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow Server 1
```

In the server1 web page, click the button "Fetch Data From Server 2" and observe the effects of these changes in the server 1 page. 
