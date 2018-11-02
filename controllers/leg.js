const client = require('../config/database').onthology;

var Leg = module.exports

// Lista todos os itens legislativos: id, data, numero, tipo, sumario, entidades
Leg.listar = () => {
    return client.query(
        `SELECT  
            ?id ?data ?numero ?tipo ?sumario
            (GROUP_CONCAT(CONCAT(STR(?ent),"::",?entSigla); SEPARATOR=";") AS ?entidades)
        WHERE { 
            ?id rdf:type clav:Legislacao;
                clav:diplomaData ?data;
                clav:diplomaNumero ?numero;
                clav:diplomaTipo ?tipo;
                clav:diplomaTitulo ?sumario.
            optional{
                ?id clav:diplomaEntidade ?ent.
                ?ent clav:entSigla ?entSigla;
            }
        }
        Group by ?id ?data ?numero ?tipo ?sumario
        Order by desc (?data)`
    )
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error(error))
}

// Devolve a informação associada a um documento legislativo: tipo data numero sumario link entidades
Leg.consultar = id => {
    var fetchQuery = `
        SELECT  
            ?tipo ?data ?numero ?sumario ?link
            (GROUP_CONCAT(CONCAT(STR(?ent),"::",?entSigla,"::",?entDesignacao); SEPARATOR=";") AS ?entidades)
        WHERE { 
            clav:${id} a clav:Legislacao;
                clav:diplomaData ?data;
                clav:diplomaNumero ?numero;
                clav:diplomaTipo ?tipo;
                clav:diplomaTitulo ?sumario;
                clav:diplomaLink ?link;

            OPTIONAL{
                clav:${id} clav:diplomaEntidade ?ent.
                ?ent clav:entSigla ?entSigla;
                     clav:entDesignacao ?entDesignacao.
            }
        } GROUP BY ?tipo ?data ?numero ?sumario ?link
    `
    return client.query(fetchQuery)
        .execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error(error))
}

// Devolve a lista de processos regulados pelo documento: id, codigo, titulo
Leg.regula = id => {
    var fetchQuery = `
        SELECT DISTINCT ?id ?codigo ?titulo WHERE { 
            {
                ?id clav:temLegislacao clav:${id};
            } 
            UNION {
                ?crit clav:temLegislacao clav:${id} .
                ?just clav:temCriterio ?crit .
                ?aval clav:temJustificacao ?just .

                {
                    ?id clav:temPCA ?aval ;
                } 
                UNION {
                    ?id clav:temDF ?aval ;
                }
            }
            ?id clav:codigo ?codigo;
                clav:titulo ?titulo;
                clav:classeStatus 'A'.
                
        } ORDER BY ?codigo
    `
    return client.query(fetchQuery).execute()
        .then(response => Promise.resolve(response.results.bindings))
        .catch(error => console.error(error))
}

Leg.ultNum = function(){
    var fetchQuery = `
        select (count (?s) as ?num)  where { 
            ?s a clav:Legislacao .
        }
    `
    return client.query(fetchQuery)
        .execute()
        // a obter o número de legislações na BD
        .then(response => {
            return(response.results.bindings[0].num.value)
        })
        .catch(function (error) {
            console.error("Legislação: Erro ao executar a query de contagem: " + error)
        })
}



Leg.checkNumberAvailability = function (number) {
    var checkQuery = `
            SELECT (count(*) AS ?Count) WHERE {
                ?leg rdf:type clav:Legislacao ;
                    clav:diplomaNumero '${number}'
            }
        `;

    return client.query(checkQuery).execute()
        //Getting the content we want
        .then(response => Promise.resolve(response.results.bindings[0].Count.value))
        .catch(function (error) {
            console.error("Error in check:\n" + error);
        });
}
