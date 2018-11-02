const client = require('../config/database').onthology;

var Entidades = module.exports

Entidades.listar = function () {
    return client.query(
        `SELECT ?id ?sigla ?designacao ?internacional {
            ?id rdf:type clav:Entidade ;
                clav:entEstado "Ativa";
                clav:entDesignacao ?designacao ;
                clav:entSigla ?sigla ;
                clav:entInternacional ?internacional.
        }`
    )
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(function (error) {
            console.error("Listagem: " + error);
        });
}

Entidades.tipologias = id => {
    var fetchQuery = `
        SELECT ?id ?sigla ?designacao WHERE {
            clav:${id} clav:pertenceTipologiaEnt ?id .
            
            ?id clav:tipEstado "Ativa";
                clav:tipSigla ?sigla;
                clav:tipDesignacao ?designacao.
        }
    `
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Tipologias a que x pertence: " + error))
}

Entidades.consultar = id => {
    return client.query(`
    SELECT ?sigla ?designacao ?estado ?internacional
    WHERE {
            clav:${id} rdf:type clav:Entidade ;
                clav:entDesignacao ?designacao ;
                clav:entSigla ?sigla ;
                clav:entEstado ?estado ;
                clav:entInternacional ?internacional .
    }`
    )
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Erro na consulta de uma entidade: " + error))
}

Entidades.dono = id => {
    var fetchQuery = `
        SELECT ?id ?codigo ?titulo WHERE {
            ?id clav:temDono clav:${id} ;
                clav:codigo ?codigo ;
                clav:titulo ?titulo ;
                clav:pertenceLC clav:lc1 ;
                clav:classeStatus "A" .
        }
    `
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Dominio de org: " + error))
}

Entidades.participante = id => {
    var fetchQuery = `
        select ?id ?codigo ?titulo where { 
            ?id clav:temParticipante clav:${id} ;
                ?Type clav:${id} ;
                clav:titulo ?titulo ;
                clav:codigo ?codigo ;
                clav:pertenceLC clav:lc1 ;
                clav:classeStatus "A" .
            
            filter (?Type!=clav:temParticipante && ?Type!=clav:temDono)
        }`
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error("Erro no acesso ao GraphDB, participações de uma entidade: " + error))
}
