var Leg = require('../controllers/leg.js');
var fa = require('../controllers/funcAux.js')

var express = require('express');
var router = express.Router();

// Lista todos os itens legislativos: id, data, numero, tipo, sumario, entidades
router.get('/', (req, res) => {
    Leg.list()      
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'data', 'numero', 'tipo','sumario', 'entidades'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na listagem da legislação: " + erro}))
})

// Devolve a informação associada a um documento legislativo: tipo data numero sumario link entidades
router.get('/:id', (req, res) => {
    Leg.consulta(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['tipo', 'data', 'numero', 'sumario', 'link', 'entidades'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta da legislação: " + erro}))
})

// Devolve a lista de processos regulados pelo documento: id, codigo, titulo
router.get('/:id/regula', (req, res) => {
    Leg.regula(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta dos processos regulados: " + erro}))
})

module.exports = router;