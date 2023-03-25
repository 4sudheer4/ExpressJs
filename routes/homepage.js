const express = require('express');
const router_homepage = express.Router();

router_homepage.get('/', (req, res) =>{
    res.send('Hello World!!!');
});

module.exports = router_homepage;