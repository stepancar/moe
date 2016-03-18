
export function birthPlaceForOccupation(occupation: string, limit: number = 20) {
    return (
        "PREFIX wd: <http://www.wikidata.org/entity/>\n" +
        "PREFIX wdt: <http://www.wikidata.org/prop/direct/>\n" +
        "PREFIX wikibase: <http://wikiba.se/ontology#>\n" +
        "PREFIX p: <http://www.wikidata.org/prop/>\n" +
        "PREFIX v: <http://www.wikidata.org/prop/statement/>\n" +
        "PREFIX q: <http://www.wikidata.org/prop/qualifier/>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        `
        SELECT ?subj ?label ?coord ?place ?occupationLabel ?occupation ?picture WHERE {
           ?subj wdt:P106 ?occupation .
           ?occupation rdfs:label ?occupationLabel filter (lang(?occupationLabel) = "en") .
           FILTER(STRSTARTS(?occupationLabel, '${occupation}')) .
           ?subj wdt:P19 ?place .
           ?place wdt:P625 ?coord .
           ?subj wdt:P18 ?picture .
           ?subj rdfs:label ?label filter (lang(?label) = "en")
        }
        LIMIT ${limit}`
    );
}
