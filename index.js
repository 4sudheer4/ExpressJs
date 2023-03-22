const Joi = require('joi'); //class is returned
const logger = require('./logger');
const express = require('express'); //this returns a function
const helmet = require('helmet');
const morgan = require('morgan');
const app = new express(); //this is an instance of the above function. app is object here.

//the below are to set the development environments. 
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//here 'env' will get the NODE_ENV defined above or the default would be 'development'
console.log(`app:${app.get('env')}`);

 // this is a middleware created by "express.json()" and app.use will be using it.
 //this will take the input body Json and output in the form of req.body
 //below are built-in middleware functions.

app.use(express.json()); //this will take json as input and parse it into req.body
app.use(express.urlencoded({extended: true})); //this will take key value as input and parse it into req.body
//css, images etc will be kept in the folder called 'public'. 
//Now if we hit "localhost/readme.txt", that will display the file.
app.use(express.static('public')); 
app.use(helmet());
if(app.get('env') === 'development'){
    app.use(morgan('tiny')); //this is a http calls logger like "GET /api/cars 200 70 - 7.685 ms"
    console.log('morgan is enabled');
}
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

app.use(logger.log);
app.use(logger.auth);

const cars = [
    {id:1, name: "car1"},
    {id:2, name: "car2"},
    {id:3, name: "car3"}
]
app.get('/', (req, res) =>{
    res.send('Hello World!!!');
});

app.get('/api/cars',(req,res) => {
    res.send(cars);
});

// /api/cars/1
//check about array.find here: https://www.javascripttutorial.net/es6/javascript-array-find/


app.get('/api/cars/:id',(req,res) => {
    const car = cars.find( (element) =>
        element.id === parseInt(req.params.id) 
    );
    if (!car) res.status(404).send('car not found');
    res.send(car); 
});

app.get('/api/cars/:year/:month', (req, res) => {
    res.send(req.params);
});





app.post('/api/cars',(req,res) => {

    //below is the validation for the given input by the end-user.
    //check postman for how the input looks like 
    /* input in JSON postman
    {
        "name_from_json":"new car"
    }
    */
    
    const schema = Joi.object({
        name_from_json: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);
    console.log(result);

    if(result.error){
        // res.status(400).send(result.error);
        //to display just the error message access first element of details array and message tag from Json.
        res.status(400).send(result.error.details[0].message);
        return;
    }
    if(!req.body.name_from_json || req.body.name_from_json.length <3){
        //400 bad request
        res.status(400).send('Name is required and should be min of 3 chars');
        return;
    }

    const car = {
        id: cars.length+1,
        name: req.body.name_from_json
    };
    cars.push(car);
    res.send(car);
});

//update the data
app.put('/api/cars/:id', (req,res) => {
    //lookup the course
    //if not exists return 404

    const car = cars.find( (element) =>
        element.id === parseInt(req.params.id) 
    );
    console.log(car);

    if (!car) res.status(404).send('car not found');
    //validate
    //if invalid return 400
    const schema = Joi.object({
        name_from_json: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);
    if(result.error){
        // res.status(400).send(result.error);
        //to display just the error message access first element of details array and message tag from Json.
        res.status(400).send(result.error.details[0].message);
        
    }
    //update course
    car.name = req.body.name_from_json
    res.send(car);
    //return the updated course
});

app.delete('/api/cars/:id',(req,res) =>{
    //lookup for the course
    //err if not available

    const car = cars.find( (element) =>
        element.id === parseInt(req.params.id) 
    );
    console.log(car);

    if(!car) res.status(400).send('car not found');

    //if available then delete
    const index = cars.indexOf(car);
    const x = cars.splice(index,1);
    console.log(`myArray values: ${cars}`);
    console.log(`variable x value: ${x}`);
    res.send(cars);
    //return course
});

// process.env is a method which helps to decide the port. This will create an environment variable called 'PORT' below.
//we can provide env variable using 'export PORT=5000' in the terminal. and when we run this application, it will run on port 5000, 
//if ntg is given then 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

