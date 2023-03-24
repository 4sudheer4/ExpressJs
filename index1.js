//this has middlewares, environments, configs, helmet, morgan etc

const config = require('config');
const Joi = require('joi'); //class is returned
const logger = require('./logger');
const express = require('express'); //this returns a function
const helmet = require('helmet');
const morgan = require('morgan');
const app = new express(); //this is an instance of the above function. app is object here.

//pug is used to display the output in the form of html or any webpage. Here we need to set a view engine. 
//It will automatically import the 'pug' module.
app.set('view engine', 'pug');
app.set('views','./views'); //this is optional, default value is 'views' that stores all the templates.
//and now check app.get('/') for implementation of 'pug'



 // this is a middleware created by "express.json()" and app.use will be using it.
 //this will take the input body Json and output in the form of req.body
 //below are built-in middleware functions.

app.use(express.json()); //this will take json as input and parse it into req.body
app.use(express.urlencoded({extended: true})); //this will take key value as input and parse it into req.body
//css, images etc will be kept in the folder called 'public'. 
//Now if we hit "localhost/readme.txt", that will display the file.
app.use(express.static('public')); 
app.use(helmet());

//the below are to set the development environments. 
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//here 'env' will get the NODE_ENV defined above or the default would be 'development'
console.log(`app:${app.get('env')}`);

if(app.get('env') === 'development'){
    app.use(morgan('tiny')); //this is a http calls logger like "GET /api/cars 200 70 - 7.685 ms"
    console.log('morgan is enabled');
}

console.log('App name: '+ config.get('name'));
//the below are the middle ware function too. please make sure to put next() function or else the request will be loading.
 //however, we need to put these in a logger file. Hence putting them in a logger.js file
/*
app.use(function(req, res, next) {
    console.log('logging...');
    next();
})
app.use(function(req, res, next) {
    console.log('authenticating...');
    next();
})
*/
//the above middlewares are kept in logger.js file.
app.use(logger.log);
app.use(logger.auth);

const cars = [
    {id:1, name: "car1"},
    {id:2, name: "car2"},
    {id:3, name: "car3"}
]

//pug implementation. If you check "http://localhost:$PORT/" you can see html page. 
//You can also see on the html info by right clicking on the browser on the above portal and 'view source page'
app.get('/', (req, res) =>{
    res.render('index',{title: 'My express demo app', message: 'hello'});
});

app.get('/api/cars',(req,res) => {
    res.send(cars);
});

// process.env is a method which helps to decide the port. This will create an environment variable called 'PORT' below.
//we can provide env variable using 'export PORT=5000' in the terminal. and when we run this application, it will run on port 5000, 
//if ntg is given then 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));