const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
// put your routes here
app.post('/save-score', (req, res) => {
  res.send({ msg: 'great jorb' });
});

// static file declaration
app.use(express.static(path.join(__dirname, 'client/public/')));
app.use(cors());
// production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/public/')));
  //
  app.get('*', (req, res) => {
    res.sendFile(path.join((__dirname = 'client/public/index.html')));
  });
}

// build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
