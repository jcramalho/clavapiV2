var Vocabulario = require('../controllers/vocabulario.js');

var express = require('express');
var router = express.Router();


router.get('/formasContagemPCA', function (req, res) {
    Vocabulario.formasContagemPCA()
        .then(list => res.send(list))
        .catch(function (error) {
            console.error(error);
        });
})

router.get('/subFormasContagemPCA', function (req, res) {
    Vocabulario.subFormasContagemPCA()
        .then(list => res.send(list))
        .catch(function (error) {
            console.error(error);
        });
})

module.exports = router;