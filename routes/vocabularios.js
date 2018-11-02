var Vocabularios = require('../controllers/vocabularios.js')
var fa = require('../controllers/funcAux.js')

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    Vocabularios.listar()
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id','label','desc'])))
        .catch(erro => console.error(erro))
})

// Devolve a lista de termos de um VC: idtermo, termo
router.get('/:id', function (req, res) {
    Vocabularios.consultar(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['idtermo', 'termo'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta do VC "+req.params.id+": " + erro}))
})

module.exports = router;