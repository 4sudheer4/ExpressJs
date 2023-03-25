const express = require('express');
const router = express.Router();

const cars = [
    {id:1, name: "car1"},
    {id:2, name: "car2"},
    {id:3, name: "car3"}
]

//replacing '/api/cars' with '/'
//similarly all the below routes with '/api/cars' will be replaced with '/'

/*
router.get('/api/cars',(req,res) => {
    res.send(cars);
});
*/

router.get('/',(req,res) => {
    res.send(cars);
});

// /api/cars/1
//check about array.find here: https://www.javascripttutorial.net/es6/javascript-array-find/

router.get('/:id',(req,res) => {
    const car = cars.find( (element) =>
        element.id === parseInt(req.params.id) 
    );
    if (!car) res.status(404).send('car not found');
    res.send(car); 
});

router.get('/:year/:month', (req, res) => {
    res.send(req.params);
});

router.post('/',(req,res) => {

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
router.put('/:id', (req,res) => {
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

router.delete('/:id',(req,res) =>{
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

module.exports = router;