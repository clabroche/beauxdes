var express = require('express');
var router = express.Router();

router.use('/times', require('./times'))

module.exports = router;
