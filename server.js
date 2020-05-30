
const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');

const app = express();

const shoppingListRouter = require('./shoppingListRouter');
const recipesRouter = require('./recipesRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

//when the root baseurl is accessed, it rends back the file __dirname is a shorthand for the directory relative to this location.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

//turned our path routes into middlewareish statements 
//app.use('/baseendpoint', routerminiExpressApp.js);
app.use('/shopping-list', shoppingListRouter);
app.use('/recipes', recipesRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
