export function sparqlQueryJson(endpoint: string, query: string, callback: (any) => any) {
    var querypart = "query=" + encodeURIComponent(query);
    var xmlhttp = null;
    if ((window as any).XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if ((window as any).ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open('POST', endpoint, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            }
        }
    };
    xmlhttp.send(querypart);
};
