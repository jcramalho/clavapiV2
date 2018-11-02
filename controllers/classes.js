const client = require('../config/database').onthology;

var Classes = module.exports

Classes.listMeta = level => {
    if (!level) { level = 1 }

    var listQuery = `
        Select
            ?id 
            ?codigo 
            ?titulo 
        Where {
            ?id rdf:type clav:Classe_N${level} ;
                    clav:classeStatus 'A';
                    clav:codigo ?codigo ;
                    clav:titulo ?titulo .
        } 
        Order by ?id 
    `
    return client.query(listQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a metainformação de uma classe: codigo, titulo, status, desc, codigoPai?, tituloPai?, procTipo?
Classes.consulta = id => {
    var fetchQuery = `
            SELECT * WHERE { 
                clav:${id} clav:titulo ?titulo;
                    clav:codigo ?codigo;
                    clav:classeStatus ?status;
                    clav:descricao ?desc.

                OPTIONAL {
                    clav:${id} clav:temPai ?pai.
                    ?pai clav:codigo ?codigoPai;
                        clav:titulo ?tituloPai.
                } 
                
                OPTIONAL {
                    clav:${id} clav:processoTransversal ?procTrans;
                        clav:processoTipoVC ?pt.
                    ?pt skos:prefLabel ?procTipo.
                }
            }`
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a lista de filhos de uma classe: id, codigo, titulo, nFilhos
Classes.descendencia = id => {
    var fetchQuery = `
        SELECT ?id ?codigo ?titulo (count(?sub) as ?nFilhos)
        WHERE {
            ?id clav:temPai clav:${id} ;
                    clav:codigo ?codigo ;
                    clav:titulo ?titulo .
            optional {
                ?sub clav:temPai ?id .
            }
        }Group by ?id ?codigo ?titulo
    `
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a lista de notas de aplicação de uma classe: idNota, nota
Classes.notasAp = id => {
    var fetchQuery = `
            SELECT * WHERE { 
                clav:${id} clav:temNotaAplicacao ?idNota.
                ?idNota clav:conteudo ?nota .
            }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch( erro => console.error(erro))
}

// Devolve a lista de exemplos de notas de aplicação de uma classe: [exemplo]
Classes.exemplosNotasAp = id => {
    var fetchQuery = `
            SELECT * WHERE { 
                clav:${id} clav:exemploNA ?exemplo.
            }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a lista de notas de exclusão de uma classe: idNota, nota
Classes.notasEx = id => {
    var fetchQuery = `
            SELECT * WHERE { 
                clav:${id} clav:temNotaExclusao ?idNota.
                ?idNota clav:conteudo ?nota .
            }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve os termos de índice de uma classe: idTI, termo
Classes.ti = id => {
    var fetchQuery = `
    SELECT * WHERE { 
        ?idTI a clav:TermoIndice;
              clav:estaAssocClasse clav:${id} ;
              clav:termo ?termo
    }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a(s) entidade(s) dona(s) do processo: id, tipo, sigla, designacao
Classes.dono = id => {
    var fetchQuery = `
        SELECT ?id ?tipo ?sigla ?designacao WHERE { 
            clav:${id} clav:temDono ?id.
            {
                ?id clav:entDesignacao ?designacao;
                    a ?tipo;
                    clav:entSigla ?sigla.
            } UNION {
                ?id clav:tipDesignacao ?designacao;
                a ?tipo;
                clav:tipSigla ?sigla .
            }
        FILTER ( ?tipo NOT IN (owl:NamedIndividual) )
        }`  
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a(s) entidade(s) participante(s) no processo: id, sigla, designacao, tipoParticip
Classes.participante = id => {
    var fetchQuery = `
        select ?id ?sigla ?designacao ?tipoParticip where { 
            clav:${id} clav:temParticipante ?id ;
                            ?tipoParticip ?id .
                {
                    ?id clav:entDesignacao ?designacao;
                        clav:entSigla ?sigla .
                } UNION {
                    ?id clav:tipDesignacao ?designacao;
                        clav:tipSigla ?sigla .
                }      
        filter (?tipoParticip NOT IN (clav:temParticipante, clav:temDono))
        }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve o(s) processo(s) relacionado(s): id, codigo, titulo, tipoRel
Classes.procRel = id => {
    var fetchQuery = `
        select ?id ?codigo ?titulo ?tipoRel {
            clav:${id} clav:temRelProc ?id;
                        ?tipoRel ?id.
        
            ?id clav:codigo ?codigo;
                clav:titulo ?titulo;
                clav:classeStatus 'A'.
        
        filter (?tipoRel!=clav:temRelProc)
        } Order by ?tipoRel ?codigo
        `
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a legislação associada ao contexto de avaliação: id, tipo, numero, sumario
Classes.legislacao = id => {
    var fetchQuery = `
        SELECT ?id ?tipo ?numero ?sumario WHERE { 
            clav:${id} clav:temLegislacao ?id.
            ?id clav:diplomaNumero ?numero;
                clav:diplomaTitulo ?sumario;
                clav:diplomaTipo ?tipo.
        } order by ?tipo ?numero`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a informação base do PCA: idPCA, formaContagem, subFormaContagem, idJustificacao, valores, notas
Classes.pca = id => {
    var fetchQuery = `
        SELECT 
            ?idPCA
            ?formaContagem
            ?subFormaContagem
            ?idJustificacao
            (GROUP_CONCAT(DISTINCT ?valor; SEPARATOR="###") AS ?valores)
            (GROUP_CONCAT(DISTINCT ?nota; SEPARATOR="###") AS ?notas)
        WHERE { 
            clav:${id} clav:temPCA ?idPCA .
            OPTIONAL {
                ?idPCA clav:pcaFormaContagemNormalizada ?contNormID .    
                ?contNormID skos:prefLabel ?formaContagem .
            }
            OPTIONAL {
                ?idPCA clav:pcaSubformaContagem ?subContID .
                ?subContID skos:scopeNote ?subFormaContagem .
            }
            OPTIONAL {
                ?idPCA clav:pcaNota ?nota .
            }
            OPTIONAL {
                ?idPCA clav:pcaValor ?valor .
            }
            OPTIONAL {
                ?idPCA clav:temJustificacao ?idJustificacao .
            }    
        }GROUP BY ?idPCA ?formaContagem ?subFormaContagem ?idJustificacao 
    `
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve uma justificação, PCA ou DF, que é composta por uma lista de critérios: criterio, tipoLabel, conteudo
Classes.justificacao = id => {
    var fetchQuery = `
        SELECT
            ?criterio ?tipoLabel ?conteudo
        WHERE {
            clav:${id} clav:temCriterio ?criterio . 
            ?criterio clav:conteudo ?conteudo.
            ?criterio a ?tipo.
            ?tipo rdfs:subClassOf clav:CriterioJustificacao.
            ?tipo rdfs:label ?tipoLabel.
        }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a informação base do DF: idDF, valor, idJustificacao
Classes.df = function (id) {
    var fetchQuery = `
        SELECT 
            ?idDF ?valor ?idJustificacao
        WHERE { 
            clav:${id} clav:temDF ?idDF .
            OPTIONAL {
                ?idDF clav:dfValor ?valor ;
            }
            OPTIONAL {
                ?idDF clav:dfNota ?Nota ;
            }
            OPTIONAL {
                ?idDF clav:temJustificacao ?idJustificacao .
            }    
        }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}
