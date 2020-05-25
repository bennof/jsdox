/** 
* @module jsdox/url
*/


/**
 * Scan and return header fields of XHTTP requests
 * @param {*} Res a Xhttp response object
 * @returns a map of header fields
 */
export function header_map(Res){
    var i, Elem, Key, Value, R={}, HL = Xhttp.getAllResponseHeaders().trim().split(/[\r\n]+/);
    for ( i=0; i<HL.length; i++ ) {
        Elem = HL[i].split(': ');
        Key   = Elem.shift();
        Value = Elem.join(': ');
        R[Key] = Value;
    }
    return R;
}
  
/**
 * easier access to url encoded hash fields
 * @param {*} URL a url like window.location
 * @returns a map of hash values in url 
 */
export function hash_map(URL){
    var i, R1, Res={}, Hash = (URL.hash.substr(1)).split("&");
    for (i=0; i<Hash.length; i++) {
        R1 = Hash[i].split("=");
        Res[R1[0]]=decodeURIComponent(R1[1]) || R1[0];
    }
    return Res;
}
  

/**
 * easier access to url encoded query fields
 * @param {*} URL a url like window.location
 * @returns a map of query values in url 
 */
export function query_map(URL){
    var i, R1, Res={}, Query = (URL.search.substr(1)).split("&");
    for (i=0; i<Query.length; i++) {
        R1 = Query[i].split("=");
        Res[R1[0]]=R1[1] || R1[0];
    }
    return Res;
}