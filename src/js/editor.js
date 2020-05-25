import {process} from './core';
import expand from 'emmet';

export var TAG_EDITOR = "jsdox-editor";


function editor_create_add_menu(target,edit){
    var div = document.createElement('DIV');
    div.classList.add("edit_menu");
    var button_add = document.createElement('BUTTON');
    div.appendChild(button_add);
    button_add.innerText = '+';
    button_add.onclick = editor_add_block.bind({target: target, edit: edit});
    button_add = document.createElement('BUTTON');
    div.appendChild(button_add);
    button_add.innerText = 'ok';
    button_add.onclick = editor_disable_block_edit;
    button_add = document.createElement('BUTTON');
    div.appendChild(button_add);
    button_add.innerText = 'save';
    button_add.onclick = editor_save_html_doc.bind({target: target});
    return div;
}

function editor_on_tab_expand(e){
    //console.log(e);
    if(e.keyCode == 9){
        e.preventDefault();
        console.log(e.target.selectionStart);
        var line_end = e.target.selectionStart;
        var line_start = line_end-1;
        var line = e.target.value;
        while(line_start>=0 && line.charAt(line_start)!='\n'&& line.charAt(line_start)!=' ')
            line_start--;
        line_start++;
        var line = line.substring(line_start,line_end).trim();
        console.log(line);
        try {
            line = expand(line);
            var ll = line.length + line_start;
            line += e.target.value.substring(line_end);
            e.target.value = e.target.value.substring(0,line_start)+line;
            e.target.selectionStart = ll;
            e.target.selectionEnd = ll;
        } catch (e) {}
        
    }
}

var CURRENT_EDIT_TARGET = null;
function editor_enable_block_edit(target){
    editor_disable_block_edit();
    var txt = document.createElement('TEXTAREA');
    txt.onkeydown = editor_on_tab_expand;
    txt.classList = target.classList;
    txt.value = target.innerHTML;
    CURRENT_EDIT_TARGET = {target: target, edit: txt };
    target.parentNode.replaceChild(txt,target);
    txt.focus();
}

function editor_disable_block_edit(){
    if(CURRENT_EDIT_TARGET) {
        CURRENT_EDIT_TARGET.target.innerHTML = CURRENT_EDIT_TARGET.edit.value;
        CURRENT_EDIT_TARGET.edit.parentNode.replaceChild(CURRENT_EDIT_TARGET.target,CURRENT_EDIT_TARGET.edit);
        process(CURRENT_EDIT_TARGET.target);
        CURRENT_EDIT_TARGET = null;
    }
}

function editor_save_html_doc() {
    editor_disable_block_edit();
    //this.target.removeAttribute(TAG_EDITOR);
    console.log(this.target)
    alert(this.target.innerHTML);
    //this.target.setAttribute(TAG_EDITOR,"")
    return null;
}

function editor_add_block(){
    editor_disable_block_edit();
    var r = prompt("Add block:","div.content");
    if(!r) return;
    r = expand(r);
    console.log("Add Block: "+r);
    this.target.innerHTML = this.target.innerHTML+r;
    for(var i = 0; i < this.target.children.length; i++){
        this.target.children[i].onclick = this.edit;
    }
    var cur = this.target.children[this.target.children.length-1];
    cur.onclick = this.edit;
    editor_enable_block_edit(cur);
}

function editor_edit_block(e){
    var elem = e.target;
    while(!elem.onclick)
        elem = elem.parentNode;
    editor_enable_block_edit(elem);
}


export function enable(target = document, ctx = window){
    var target = document.querySelector('['+TAG_EDITOR+']');
    var fedit = editor_edit_block.bind({target: target});
    for(var i = 0; i < target.children.length; i++){
        target.children[i].onclick = fedit;
    }
    target.parentNode.appendChild(editor_create_add_menu(target,fedit));
}