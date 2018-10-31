const client = require('../../config/database').onthology;

var Vocabulario = module.exports

Vocabulario.list = () => {
    let fetchQuery = `
    SELECT *
    WHERE {
        ?id a skos:ConceptScheme;
            skos:prefLabel ?label.
        OPTIONAL {
            ?id skos:scopeNote ?desc.
        }       
    } 
    `
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error(error))
}

Vocabulario.formasContagemPCA = () => {
    let fetchQuery = `
        SELECT DISTINCT ?id ?Label WHERE { 
            ?pca clav:pcaFormaContagemNormalizada ?id .    
            ?id skos:prefLabel ?Label .
        } 
    `
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error(error))
}

Vocabulario.subFormasContagemPCA = function () {
    let fetchQuery = `
        SELECT DISTINCT ?id ?Label WHERE { 
            ?pca clav:pcaSubformaContagem ?id .    
            ?id skos:scopeNote ?Label .
        } 
    `;

    return client.query(fetchQuery)
        .execute()
        //getting the content we want
        .then(response => Promise.resolve(response.results.bindings))
        .catch(function (error) {
            console.error(error);
        });
}