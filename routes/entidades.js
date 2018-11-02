var Entidades = require('../controllers/entidades.js');
var fa = require('../controllers/funcAux.js')

var express = require('express');
var router = express.Router();

router.get('/erro', (req, res) => res.jsonp({cod: "Código do Erro", mensagem: "Mensagem de erro."}))

// Lista todas as entidades: id, sigla, designacao, internacional
router.get('/', (req, res) => {
    Entidades.listar()      
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'sigla', 'designacao', 'internacional'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na listagem das entidades: " + erro}))
})

// Consulta de uma entidade: sigla, designacao, estado, internacional
router.get('/:id', (req, res) => {
    Entidades.consultar(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['sigla', 'designacao', 'estado', 'internacional'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta da entidade "+req.params.id+": " + erro}))
})

// Lista as tipologias a que uma entidade pertence: id, sigla, designacao
router.get('/:id/tipologias', (req, res) => {
    Entidades.tipologias(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'sigla', 'designacao'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta das tipologias a que "+req.params.id+" pertence: " + erro}))
})

// Lista os processos em que uma entidade intervem como dono
router.get('/:id/intervencao/dono', (req, res) => {
    Entidades.dono(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na consulta dos PNs em que "+req.params.id+" é dono: " + erro}))
})

// Lista os processos em que uma entidade intervem como participante
router.get('/:id/intervencao/participante', (req, res) => {
    Entidades.participante(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo'])))
        .catch(erro => res.jsonp({cod: "408", mensagem: "Erro na query sobre as participações da entidade "+req.params.id+": " + erro}))
})

module.exports = router;