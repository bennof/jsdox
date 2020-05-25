/** 
* @module jsdox/loaders
*/

import * as url from "./url";
//import * as file from "./file";

export var TAG_ROUTER = "jsdox-router";
export var TAG_LOAD = "jsdox-load";
export var TAG_VALUE = "jsdox-value";


// Create clean code
var EntityMap = {"&": "&amp;","<": "&lt;",">": "&gt;",'"': '&quot;',"'": '&#39;',"/": '&#x2F;'};
function escape_html(string) { return String(string).replace(/[&<>"'\/]/g, function (s) { return EntityMap[s]; }); };
function clean_code(Target) {
    var i, Elem, New, CodeElems = Target.querySelectorAll('[clean-code]');
    for(i=0; i<CodeElems.length; i++) {
        Elem = CodeElems[i];
        New = escape_html(Elem.innerHTML)
        Elem.innerHTML = New;
    }
};

function load_data(uri,Cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4){
            if (xhr.status == 200) {
                Cb(xhr.responseText);
            } else {
                console.log("Error: ("+xhr.status+")");
            }
        }
    };
    xhr.open('GET', uri, true);
    xhr.send();
};

function exec_js(target, context = window){
    var i, cur, scripts = target.querySelectorAll('SCRIPT');
    for (i=0;i<scripts.length; i++){
        cur = scripts[i];

        // is file ?
        if(cur.src != "") {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", cur.src, false);  // synchronous request
            xhr.send(null);
            cur.innerText = xhr.responseText;
            cur.src = "";
        }

        // execute in context
        try {
            console.log(cur.innerText)
            eval.call(context,cur.innerText);
        } catch (e) {
            console.error("ERROR: exec js!" + e);
        }
    }
}

function replace_vals(target, ctx = window ){
    var i, cur, val, vals = target.querySelectorAll('['+TAG_VALUE+']');
    for (i=0; i<vals.length; i++){
        cur = vals[i];
        val = cur.getAttribute(TAG_VALUE);
        if(!val) {
            val = cur.innerText;
            cur.setAttribute(TAG_VALUE,val)
        }
        try {
            cur.innerHTML = eval.call(ctx,val);
        } catch(e){
            console.error("ERROR: replace val!" + e);
        }
    }
}

/**
 * process all elements with jsdox attributes
 * @param {*} target HTML element
 * @param {*} ctx JS context for script tags, default is window
 */
export function process(target, ctx = window){
    clean_code(target); // clean code elements
    load(target, ctx); // first load and process dependencies
    exec_js(target,ctx); // execute js 
    replace_vals(target,ctx); // replace values
    if (typeof MathJax != "undefined") 
        MathJax.typesetPromise(target);
}

/**
 * load all static included html pages and process content
 * @param {*} target HTML element to scan, default is document
 * @param {*} ctx JS context for script tags, default is window
 */
export function load(target = document, ctx = window){
    var i, elem, uri, elems = target.querySelectorAll('['+TAG_LOAD+']');
    for ( i=0; i<elems.length; i++ ){
        elem = elems[i];
        uri = elem.getAttribute(TAG_LOAD);
        load_data(uri, function(e){
            this.target.innerHTML = e;
            process(this.target, this.ctx);
        }.bind({target: elem, ctx: ctx}));
    }
}


function handle_router(){
    var map = url.hash_map(window.location);
    // check if route in url hash else use default
    var uri = (map[TAG_ROUTER])? map[TAG_ROUTER] : this.target.getAttribute(TAG_ROUTER);
    console.log("routing: "+uri)
    // load and process data
    load_data(uri, function(e){
        this.target.innerHTML = e;
        process(this.target, this.ctx);
    }.bind({target: this.target, ctx: this.context}));
}

/**
 * enable a hash tag router
 * @param {*} ctx JS context for script tags, default is window
 */
export function router(ctx = window){
    var target = document.querySelector('['+TAG_ROUTER+']');
    var func = handle_router.bind({target: target, context: ctx});
    window.onhashchange = func;
    func();
}





