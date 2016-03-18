const prefixes = 'PREFIX wd: <http://www.wikidata.org/entity/>\n' +
    'PREFIX wdt: <http://www.wikidata.org/prop/direct/>\n' +
    'PREFIX wikibase: <http://wikiba.se/ontology#>\n' +
    'PREFIX p: <http://www.wikidata.org/prop/>\n' +
    'PREFIX v: <http://www.wikidata.org/prop/statement/>\n' +
    'PREFIX q: <http://www.wikidata.org/prop/qualifier/>\n' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n';

export function birthPlaceForOccupation(occupation: string, limit = 20) {
    return (
        prefixes +
        `
        SELECT ?subj ?label ?coord ?place ?occupationLabel ?occupation ?picture WHERE {
           ?subj wdt:P106 ?occupation .
           ?occupation rdfs:label ?occupationLabel filter (lang(?occupationLabel) = 'en') .
           FILTER(STRSTARTS(?occupationLabel, '${occupation}')) .
           ?subj wdt:P19 ?place .
           ?place wdt:P625 ?coord .
           ?subj wdt:P18 ?picture .
           ?subj rdfs:label ?label filter (lang(?label) = 'en')
        }
        LIMIT ${limit}`
    );
}

export function countries() {
    return (
        prefixes + `
        SELECT ?country ?label {
           ?country wdt:P31 wd:Q6256 .
           ?country rdfs:label ?label filter (lang(?label) = 'en')
        }
      `
    );
}
