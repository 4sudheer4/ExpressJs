const express = require('express'); //this returns a function
const app = express(); //this is an instance of the above function. app is object here.

app.get('/', (req, res) =>{
    res.send('Hello World!!!');
});

app.get('/api/cars',(req,res) => {
    res.send([1,2,3]);
});

// PORT

app.listen(3000, () => console.log('Listening on port 3000'));

