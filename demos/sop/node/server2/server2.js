const express = require('express');
const app = express();
const path = require('path');

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow Server 1
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/data.json', (req, res) => {
  res.json({ message: "Hello from Server 2!" });
});

app.listen(4000, () => {
  console.log('Server 2 running at http://localhost:4000');
});

