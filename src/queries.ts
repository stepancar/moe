import {sparqlQueryJson} from './sparqlJson';
const wikiDataEndPoint = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';

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
        SELECT ?subj ?lat ?long ?label ?place ?occupationLabel ?occupation ?picture WHERE {
           ?subj wdt:P106 ?occupation .
           ?occupation rdfs:label ?occupationLabel filter (lang(?occupationLabel) = 'en') .
           FILTER(STRSTARTS(?occupationLabel, '${occupation}')) .
           ?subj wdt:P19 ?place .
           ?place p:P625 ?coordinate .
           ?coordinate psv:P625 ?coordinate_node .
           ?coordinate_node wikibase:geoLatitude ?lat .
           ?coordinate_node wikibase:geoLongitude ?long .
           ?subj wdt:P18 ?picture .
           ?subj rdfs:label ?label filter (lang(?label) = 'en')
        }
        LIMIT ${limit}`
    );
}

export interface GeoFrame {
    maxLatitude: number;
    minLatitude: number;
    maxLongitude: number;
    minLongetude: number;
}

export function getPlacesByGeoFrame(geoFrame: GeoFrame, limit = 20, callback: (data) => any) {

    const query = prefixes + (`

      SELECT DISTINCT ?item ?name ?coord ?lat ?long WHERE {
         ?item wdt:P131* wd:Q61 .
         ?item wdt:P31/wdt:P279* wd:Q33506 .
         ?item wdt:P625 ?coord .
         ?item p:P625 ?coordinate .
         ?coordinate psv:P625 ?coordinate_node .
         ?coordinate_node wikibase:geoLatitude ?lat .
         ?coordinate_node wikibase:geoLongitude ?long .
           filter (
             ?lat>${geoFrame.minLatitude} && ?lat<${geoFrame.maxLatitude} &&
             ?long>${geoFrame.minLongetude} && ?long<${geoFrame.maxLongitude}
           ).
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "en" .
            ?item rdfs:label ?name
          }
        }
        ORDER BY ASC (?name)
        #LIMIT ${limit}`
    );
    sparqlQueryJson(wikiDataEndPoint, query, (data) => callback(JSON.parse(data).results.bindings));
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
