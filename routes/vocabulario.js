var Vocabulario = require('../controllers/vocabulario.js')
var fa = require('../controllers/funcAux.js')

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    Vocabulario.list()
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'label', 'desc'])))
        .catch(error => console.error(error))
})

router.get('/formasContagemPCA', (req, res) => {
    Vocabulario.formasContagemPCA()
        .then(dados => res.send(dados))
        .catch(error => console.error(error))
})

router.get('/subFormasContagemPCA', (req, res) => {
    Vocabulario.subFormasContagemPCA()
        .then(dados => res.send(dados))
        .catch(error => console.error(error))
})

module.exports = router;