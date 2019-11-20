const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/recipes', {useUnifiedTopology:true, useNewUrlParser:true})
.then(()=> console.log("Connected to mongodb..."))
.catch((err => console.error("could not connect ot mongodb...", err)));


/*
//render our html page
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});*/