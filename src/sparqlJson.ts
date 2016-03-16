export function sparqlQueryJson(queryStr, endpoint, callback, isDebug) {
      var querypart = "query=" + escape(queryStr);
      var xmlhttp = null;
      if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
     } else if(window.ActiveXObject) {
       xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
     } 
     xmlhttp.open('POST', endpoint, true);
     xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
     xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");
     xmlhttp.onreadystatechange = function() {
       if(xmlhttp.readyState == 4) {
         if(xmlhttp.status == 200) {
           if(isDebug) {
                        // see results of the SPARQL query
                    alert(xmlhttp.responseText);
           }
           callback(xmlhttp.responseText);
         }
       }
     };
     xmlhttp.send(querypart);
    };
