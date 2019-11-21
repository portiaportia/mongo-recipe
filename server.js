const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/recipes', {useUnifiedTopology:true, useNewUrlParser:true})
.then(()=> console.log("Connected to mongodb..."))
.catch((err => console.error("could not connect ot mongodb...", err)));

const recipeSchema = new mongoose.Schema({
    title:String,
    author:String,
    rating:Number,
    ingredients:[String],
    directions:[String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

async function createRecipe(recipe){
    const result = await recipe.save();
    console.log(result);
}

/*
const chocCookie = new Recipe({
    title:"Chocolate Chip Cookies",
    author:"Sam Young",
    rating:3.4,
    ingredients:["flour","sugar","butter","milk","eggs","chips"],
    directions:["mix dry ingredients", "mix wet ingredients", "mix everything", "put on cookie sheet", "bake"]
});

createRecipe(chocCookie);
*/

function validateRecipe(recipe){
    const schema = {
        title:Joi.string().min(3).required(),
        author:Joi.string(),
        rating:Joi.number(),
        ingredients:Joi.allow(),
        directions:Joi.allow()
    };

    return Joi.validate(recipe, schema);
}

app.post('/api/recipes', (req,res)=>{
    const result = validateRecipe(req.body);

    if(result.error){
        res.status(400).send(result.err.details[0].message);
        return;
    }

    const recipe = new Recipe({
        title:req.body.title,
        author:req.body.author,
        rating:Number(req.body.rating),
        ingredients:req.body.ingredients,
        directions:req.body.directions
    });

    createRecipe(recipe);
    res.send(recipe);

});


//render our html page
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

async function getRecipes(res){
    const recipes = await Recipe.find();
    console.log(recipes);
    res.send(recipes);
}

app.get('/api/recipes',(req,res)=>{
    const recipes = getRecipes(res);
});

app.get('/api/recipes/:id',(req,res)=>{
    let recipe = getRecipe(req.params.id,res)
})

async function getRecipe(id,res){
    const recipe = await Recipe
    .findOne({_id:id});
    console.log(recipe);
    res.send(recipe);
}

app.put('/api/recipes/:id',(req,res)=>{
    //validate 
    //if invalid return 400 - bad request
    const result = validateRecipe(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateRecipe(res,req.params.id, req.body.title, req.body.author, req.body.rating, req.body.ingredients, req.body.directions );
});

async function updateRecipe(res, id, title, author, rating, ingredients, directions) {
    //fist param: to find, second update
    const result = await Recipe.updateOne({_id:id},{
        $set:{
            title:title,
            author:author,
            rating: Number(rating),
            ingredients: ingredients,
            directions:directions
        }
    })
    
    res.send(result);
}

app.delete('/api/recipes/:id',(req,res)=>{
    removeCourse(res, req.params.id);
});

async function removeCourse(res, id) {
    //can also use delete many
    //const result = await Course.deleteOne({_id:id});
    const recipe = await Recipe.findByIdAndRemove(id);
    res.send(recipe);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});