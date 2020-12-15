const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require('body-parser');

// const Score = require('./models/Score');
app.use(bodyParser.json());
// put your routes here
app.post('/save-score', async ({ body: { name, score } }, res) => {
  // if (!name || !score)
  //   return res.send({ err: `Missing ${!name ? 'name' : 'score'} field` });
  // else {
  //   const newScore = new Score({ name, score });
  //   newScore
  //     .save()
  //     .then((result) => res.send({ result }))
  //     .catch((err) => res.send({ err }));
  // }
  res.send({ name, score });
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
