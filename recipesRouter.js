//create a mini express app with Router
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Recipes} = require('./models');

Recipes.create('chilidogs',['chili','buns','hot dog']);
Recipes.create('chocolate milk',['cocoa','milk','sugar']);

/*NOTE: All the route handler logic for app.method('/shopping-list')
        is being kept in this .js file
NOTE#2: use "router.method()" instead of app.method()  */

router.get('/',jsonParser, (req,res) => {
    res.json(Recipes.get());
  });
  
  router.post('/', jsonParser, (req,res)=> {
    console.log((req.body));
    if(!req.body.name || !req.body.ingredients){
      return res.status(400).send("missing either name or ingredients for the recipe");
    }
    const item = Recipes.create(req.body.name, req.body.ingredients);
    res.status(201).json(item);
  })
  
  router.delete('/:id', jsonParser, (req,res) => {
    if(!Recipes.items[req.params.id]){
      res.status(400).send("invalid or missing id");
    }
    const item = Recipes.items[req.params.id];
    console.log("DELETING: ", item);
    Recipes.delete(req.params.id);
    res.status(201).end();
  })
  
  router.put('/:id', jsonParser, (req,res) => {
    if(!Recipes.items[req.params.id] || req.params.id !== req.body.id){
      res.status(400).send("ERROR: either the id in url is wrong or that id does not match the id in request body");
    }
    Recipes.update(req.body);
    res.status(204).end();
  })


  //export our router instance.
  module.exports = router;