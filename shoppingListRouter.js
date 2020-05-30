const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {ShoppingList} = require('./models');
/*NOTE: All the route handler logic for app.method('/shopping-list')
        is being kept in this .js file
NOTE#2: use "router.method()" instead of app.method() and we don't need to include '/shopping-list' in the paths anymore. */

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

//when the root of this router is called with GET,
//return all Shoppinglist items
router.get('/', (req, res) => {
    res.json(ShoppingList.get());
  });
  
router.post('/', jsonParser, (req,res) => {
if(!req.body.name || !req.body.budget){
    return res.status(400).send("missing shopping item name or budget");
}
const item = ShoppingList.create(req.body.name, req.body.budget);
res.status(201).json(item);
})

router.delete('/:id', jsonParser, (req,res) => {
if(!ShoppingList.items[req.params.id]){
    return res.status(400).send("invalid id or missing '/id' in url");
}
const item = ShoppingList.items[req.params.id];
console.log("deleting item: ", item);
ShoppingList.delete(item.id);
res.status(204).end();
});

router.put('/:id', jsonParser, (req,res) => {
if(!ShoppingList.items[req.params.id] || req.params.id !== req.body.id){
    res.status(400).send("ERROR: either your item id in url does not match the id in request body or the id does not exist");
}
ShoppingList.update(req.body);
res.status(204).end();
})


//export our router instance.
module.exports = router;