const client = require('../config/database').onthology;

var Vocabularios = module.exports

Vocabularios.listar = () => {
    let fetchQuery = `
    SELECT ?id ?label ?desc
    WHERE {
        ?id a skos:ConceptScheme.
        OPTIONAL {
            ?id skos:prefLabel ?label.
        } 
        OPTIONAL {
            ?id skos:scopeNote ?desc.
        }       
    } 
    `
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}

// Devolve a lista de termos de um VC: idtermo, termo
Vocabularios.consultar = id => {
    var fetchQuery = `
        SELECT ?idtermo ?termo
        WHERE {
            clav:${id} skos:hasTopConcept ?idtermo .
            OPTIONAL {
                ?idtermo skos:prefLabel ?termo .
            }
        }
    `
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(erro => console.error(erro))
}