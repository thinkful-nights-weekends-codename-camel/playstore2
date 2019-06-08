const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));
const playstore = require('./playstore.js');

app.get('/playstore', (req, res) => {
  const { search = "", sort } = req.query;

  if (sort) {
    if (!['app', 'rating', 'genre'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of rating/app or genre');
    }
  }

  let results = playstore
    .filter(playstore =>
      playstore
        .app
        .rating
        .genre
        .toLowerCase()
        .includes(search.toLowerCase()));

  if (sort) {
    results
      .sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });
      
  }

  app.get('/', (req,res)=>{
    res.redirect('/playstore') 
  })

  res
  .json(results);
});