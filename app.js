const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();


app.use(cors());
app.listen(8000, () => {
    console.log("Server started on PORT 8000");
})

app.use(morgan('common'));
const playstore = require('./playstore.js');

app.get('/playstore', (req, res) => {
  const { genre, sort } = req.query;
  
  let allowableSortMethods = ['app', 'rating'];
  let allowableFilterMethods = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];

  if (sort) {
    if (!allowableSortMethods.includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    }
  }

  if (genre) {
    if (!allowableFilterMethods.includes(genre)) {
      return res
        .status(400)
        .send('Genre must be either Action, Puzzle, Strategy, Casual, Arcade or Card');
    }
  }

  let results = playstore;
  if (sort) {
    let sortTerm;// = 'App';
    if(sort === 'rating') {
      sortTerm = 'Rating';
    } else {
      sortTerm = 'App';
    }
    results = playstore
      .sort((a, b) => {
        return a[sortTerm] > b[sortTerm] ? 1 : a[sortTerm] < b[sortTerm] ? -1 : 0;
      });      
  }

  let filteredResults = results;
  if (genre) {
    filteredResults = results.filter(appItem => appItem.Genres.toLowerCase().includes(genre));
  }
  res.json(filteredResults);
});