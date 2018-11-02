const client = require('../config/database').onthology;

var Tipologias = module.exports

// Devolve a lista de tipologias: id, sigla, designacao
Tipologias.listar = () => {
    return client.query(
        `SELECT ?id ?sigla ?designacao {
            ?id rdf:type clav:TipologiaEntidade ;
                clav:tipEstado "Ativa";
                clav:tipDesignacao ?designacao ;
                clav:tipSigla ?sigla .
        }`
    )
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Erro na listagem das tipologias(controller): " + error))
}

// Devolve a informação de uma tipologia: sigla, designacao, estado
Tipologias.consultar = id => {
    return client.query(`
        SELECT ?sigla ?designacao ?estado where {
            clav:${id} clav:tipDesignacao ?designacao ;
                clav:tipSigla ?sigla ;
                clav:tipEstado ?estado ;
        }`
    )
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Erro na consulta da tipologia " + id + ": "  + error))
}

// Devolve a lista de entidades pertencentes a uma tipologia: id, sigla, designacao
Tipologias.elementos = id => {
    var fetchQuery = `
        SELECT ?id ?sigla ?designacao WHERE {
            ?id clav:pertenceTipologiaEnt clav:${id} .
            
            ?id clav:entEstado "Ativa";
                clav:entSigla ?sigla;
                clav:entDesignacao ?designacao.
        }`
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Erro na listagem dos membros da tipologia " + id + ": " + error))
}

// Devolve a lista de processos dos quais a tipologia é dono: id, codigo, titulo
Tipologias.dono = id => {
    var fetchQuery = `
        SELECT ?id ?codigo ?titulo WHERE {
            ?id clav:temDono clav:${id} ;
                clav:codigo ?codigo ;
                clav:titulo ?titulo ;
                clav:pertenceLC clav:lc1 ;
                clav:classeStatus "A" .
        }`
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Erro na listagem de processos de que um tipologia ´dona: " + error))
}

// Devolve a lista de processos dos quais a tipologia é participante: id, codigo, titulo, tipo (participação)
Tipologias.participante = id => {
    var fetchQuery = `
        select ?id ?codigo ?titulo ?tipo where { 
            ?id clav:temParticipante clav:${id} ;
                ?tipo clav:${id} ;
            
                clav:titulo ?titulo ;
                clav:codigo ?codigo ;
                clav:pertenceLC clav:lc1 ;
                clav:classeStatus "A" .
            
            filter (?tipo!=clav:temParticipante && ?tipo!=clav:temDono)
        }`
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Participações de uma tipologia: " + error))
}
