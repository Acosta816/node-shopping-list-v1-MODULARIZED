
const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
const bodyParser = require('body-parser');

// we import the ShoppingList model, which we'll
// interact with in our GET endpoint.
/*Actually, we are saying class ShoppingList extends ShoppingListBlueprint
because we are instantiating a new instance of ShoppingList object when we are
importing it. pretty crazy huh. */
const {ShoppingList} = require('./models');
const {Recipes} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

Recipes.create('chilidogs',['chili','buns','hot dog']);
Recipes.create('chocolate milk',['cocoa','milk','sugar']);


// when the root of this route is called with GET, return
// all current ShoppingList items by calling `ShoppingList.get()`
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, (req,res) => {
  if(!req.body.name || !req.body.budget){
    return res.status(400).send("missing shopping item name or budget");
  }
  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
})

app.delete('/shopping-list/:id', jsonParser, (req,res) => {
  if(!ShoppingList.items[req.params.id]){
    return res.status(400).send("invalid id or missing '/id' in url");
  }
  const item = ShoppingList.items[req.params.id];
  console.log("deleting item: ", item);
  ShoppingList.delete(item.id);
  res.status(204).end();
})

app.get('/recipes',jsonParser, (req,res) => {
  res.json(Recipes.get());
});

app.post('/recipes', jsonParser, (req,res)=> {
  console.log((req.body));
  if(!req.body.name || !req.body.ingredients){
    return res.status(400).send("missing either name or ingredients for the recipe");
  }
  const item = Recipes.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
})

app.delete('/recipes/:id', jsonParser, (req,res) => {
  if(!Recipes.items[req.params.id]){
    res.status(400).send("invalid or missing id");
  }
  const item = Recipes.items[req.params.id];
  console.log("DELETING: ", item);
  Recipes.delete(req.params.id);
  res.status(201).end();
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
