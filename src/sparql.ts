var query_string = "PREFIX omv: <http://omv.ontoware.org/2005/05/ontology#>\n\
                        SELECT ?ont ?name ?acr \n\
                        WHERE { \n\
                           ?ont a omv:Ontology .  \n\
                           ?ont omv:acronym ?acr.  \n\
                           ?ont omv:name ?name .\n\
                           FILTER (str(?acr)='SNOMEDCT')\n\
                        }";
