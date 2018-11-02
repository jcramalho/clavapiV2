var Classes = require('../controllers/classes.js')
var fa = require('../controllers/funcAux.js')

var express = require('express')
var router = express.Router()

// Devolve a lista de classes de nível 1: id, codigo, titulo
router.get('/', (req, res) => { 
    Classes.listMeta(null)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na listagem das classes de nível 1 (omisso na query): " + erro}))
})

// Devolve a lista de classes de nível n [1..4]: [id, codigo, titulo]
router.get('/nivel/:n', (req, res) => {
    Classes.listMeta(req.params.n)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na listagem das classes de nível "+req.params.n+": " + erro}))
})

// Devolve a metainformação de uma classe: codigo, titulo, status, desc, codigoPai?, tituloPai?, procTrans?, procTipo?
router.get('/:id', function (req, res) {
    Classes.consulta(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['codigo', 'titulo', 'status', 'desc', 'codigoPai', 'tituloPai', 'procTrans', 'procTipo'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta da classe "+req.params.id+": " + erro}))
})

// Devolve a lista de filhos de uma classe: id, codigo, titulo, nFilhos
router.get('/:id/descendencia', function (req, res) {
    Classes.descendencia(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta da descendência da classe "+req.params.id+": " + erro}))
})

// Devolve a lista de notas de aplicação de uma classe: idNota, nota
router.get('/:id/notasAp', (req, res) => {
    Classes.notasAp(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['idNota', 'nota'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta das notas de aplicação da classe "+req.params.id+": " + erro}))
})

// Devolve a lista de exemplos das notas de aplicação de uma classe: [exemplo]
router.get('/:id/exemplosNotasAp', (req, res) => {
    Classes.exemplosNotasAp(req.params.id)
        .then(dados => {
            var resultado = []
            for(var i=0; i < dados.length; i++){
                resultado.push(dados[i].exemplo.value)
            }
            res.jsonp(resultado)
        })
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta dos exemplos das notas de aplicação da classe "+req.params.id+": " + erro}))
})

// Devolve a lista de notas de exclusão de uma classe: idNota, nota
router.get('/:id/notasEx', (req, res) => {
    Classes.notasEx(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['idNota', 'nota'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta das notas de exclusão da classe "+req.params.id+": " + erro}))
})

// Devolve os termos de índice de uma classe: idTI, termo
router.get('/:id/ti', (req, res) => {
    Classes.ti(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['idTI', 'termo'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta dos termos de índice da classe "+req.params.id+": " + erro}))
})

// Devolve a(s) entidade(s) dona(s) do processo: id, tipo, sigla, designacao
router.get('/:id/dono', (req, res) => {
    Classes.dono(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'tipo', 'sigla', 'designacao'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta dos donos da classe "+req.params.id+": " + erro}))
})

// Devolve a(s) entidade(s) participante(s) do processo: id, sigla, designacao, tipoParticip
router.get('/:id/participante', (req, res) => {
    Classes.participante(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'sigla', 'designacao', 'tipoParticip'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta dos participantes da classe "+req.params.id+": " + erro}))
})

// Devolve o(s) processo(s) relacionado(s): id, codigo, titulo, tipoRel
router.get('/:id/procRel', (req, res) => {
    Classes.procRel(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'codigo', 'titulo', 'tipoRel'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta dos processos relacionados da classe "+req.params.id+": " + erro}))
})

// Devolve a legislação associada ao contexto de avaliação: id, tipo, numero, sumario
router.get('/:id/legislacao', (req, res) => {
    Classes.legislacao(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['id', 'tipo', 'numero', 'sumario'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta da legislação associada à classe "+req.params.id+": " + erro}))
})

// Devolve a informação base do PCA: idPCA, formaContagem, subFormaContagem, idJustificacao, valores, notas
router.get('/:id/pca', (req, res) => {
    Classes.pca(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['idPCA', 'formaContagem', 'subFormaContagem', 'idJustificacao', 'valores', 'notas'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta do PCA associado à classe "+req.params.id+": " + erro}))
})

// Devolve uma justificação, PCA ou DF, que é composta por uma lista de critérios: criterio, tipoLabel, conteudo
router.get('/justificacao/:id', (req, res) => {
    Classes.justificacao(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['criterio', 'tipoLabel', 'conteudo'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta da justificação "+req.params.id+": " + erro}))
})

// Devolve a informação base do DF: idDF, valor, idJustificacao
router.get('/:id/df', (req, res) => {
    Classes.df(req.params.id)
        .then(dados => res.jsonp(fa.simplificaSPARQLRes(dados, ['idDF', 'valor', 'idJustificacao'])))
        .catch(erro => res.jsonp({cod: "404", mensagem: "Erro na consulta do DF associado à classe "+req.params.id+": " + erro}))
})

module.exports = router;
