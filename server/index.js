const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const router = require('./routes/router');

const app = express();
const apiPort = process.env.PORT || 5000;

// Accessing the path module
const path = require('path');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
