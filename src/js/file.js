/** 
* @module jsdox/file
*/

/**
* read a file
* @param {Function} Fun Callback function (State,Data)
* @param {File} Filen a file object
* @param {String} Type optional datatype
*/
export function read(Fun,Filen,Type){
    var Reader = new FileReader();
    Reader.cb = Fun;
    Reader.onload = function(Event) {
        this.cb(200,Event.target.result);
    };
    Reader.onerror = function(Event) {
        this.cb(404,Event.target.error.code);
    };
    if(Type == "DataURL")
        Reader.readAsDataURL(Filen);
    else
        Reader.readAsText(Filen);
};

/**
* save file as download
* @param Filen Filename
* @param Mime  Mimetype
* @param Data  data string or blob
**/
export function save(Filen, Mime, Data) { // Mime text/csv;charset=utf-8
    var FileLink = document.createElement('a');
    if (Mime.startsWith('text'))
        FileLink.setAttribute('href', 'data:'+Mime+',' + encodeURIComponent(Data));
    else
        FileLink.setAttribute('href', 'data:'+Mime+',' + btoa(Data));
    FileLink.setAttribute('download', Filen);
  
    if (document.createEvent) {
        var Event = document.createEvent('MouseEvents');
        Event.initEvent('click', true, true);
        FileLink.dispatchEvent(Event);
    } else {
        FileLink.click();
    }
}