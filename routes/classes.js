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
        .then(dados => {
            var resultado = {codigo: dados[0].codigo.value, titulo: dados[0].titulo.value, 
                                status: dados[0].status.value, desc: dados[0].desc.value}
            if(dados[0].codigoPai) resultado['codigoPai'] = dados[0].codigoPai.value
            if(dados[0].tituloPai) resultado['tituloPai'] = dados[0].tituloPai.value
            if(dados[0].procTrans) resultado['procTrans'] = dados[0].procTrans.value
            if(dados[0].procTipo) resultado['procTipo'] = dados[0].procTipo.value
            res.jsonp(resultado)
        })
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

// Devolve a informação do PCA
router.get('/:id/pca', (req, res) => {
    Classes.pca(req.params.id)
        .then(dados => {
            let criteria = dados.Criterios.value.split("###");
            criteria = criteria.map(a => a.replace(/[^#]+#(.*)/, '$1'));

            Classes.criteria(criteria)
                .then(function (criteriaData) {

                    dados.Criterios.type = "array";
                    dados.Criterios.value = criteriaData;

                    res.jsonp(dados)
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
})







router.get('/filtrar/:orgs', function (req, res) {
    Classes.filterByOrgs(req.params.orgs.split(','))
        .then(list => res.send(list))
        .catch(function (error) {
            console.error(error);
        });
})

router.get('/:id/descendenciaIndex', function (req, res) {
    Classes.childrenNew(req.params.id)
        .then(list => res.send(list))
        .catch(function (error) {
            console.error(error);
        });
})

router.get('/:id/df', function (req, res) {
    Classes.df(req.params.id)
        .then(function (data) {
            let criteria = data.Criterios.value.split("###");
            criteria = criteria.map(a => a.replace(/[^#]+#(.*)/, '$1'));

            Classes.criteria(criteria)
                .then(function (criteriaData) {
                    data.Criterios.type = "array";
                    data.Criterios.value = criteriaData;

                    res.send(data);
                })
                .catch(error=>console.error(error));
        })
        .catch(error=>console.error(error));
})

router.get('/:code/check/:level', function (req, res) {
    Classes.checkCodeAvailability(req.params.code, req.params.level)
        .then(function (count) {
            res.send(count);
        })
        .catch(error=>console.error(error));
})

module.exports = router;
