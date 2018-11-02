var Tipologias = require('../controllers/tipologias.js');
var fa = require('../controllers/funcAux.js')

var express = require('express');
var router = express.Router();

// Devolve a lista de tipologias: id, sigla, designacao
router.get('/', (req, res) => {
    Tipologias.listar()
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'sigla', 'designacao'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na listagem das tipologias: " + erro}))
})

// Devolve a informação de uma tipologia: sigla, designacao, estado
router.get('/:id', (req, res) => {
    Tipologias.consultar(req.params.id) 
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['sigla', 'designacao', 'estado'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta da tipologia "+req.params.id+": " + erro}))
})

// Devolve a lista de entidades pertencentes a uma tipologia: id, sigla, designacao
router.get('/:id/elementos', (req, res) => {
    Tipologias.elementos(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'sigla', 'designacao'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta dos elementos da tipologia "+req.params.id+": " + erro}))
})

// Devolve a lista de processos dos quais a tipologia é dono: id, codigo, titulo
router.get('/:id/intervencao/dono', (req, res) => {
    Tipologias.dono(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta dos processos em que a tipologia "+req.params.id+" é dono: " + erro}))
})

// Devolve a lista de processos dos quais a tipologia é participante: id, codigo, titulo, tipo (participação)
router.get('/:id/intervencao/participante', (req, res) => {
    Tipologias.participante(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo', 'tipo'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta dos processos em que a tipologia "+req.params.id+" é participante: " + erro}))
})

module.exports = router