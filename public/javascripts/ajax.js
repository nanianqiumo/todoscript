function a(opt) {
    opt = opt || {};  
    opt.method = opt.method.toUpperCase() || 'POST';  
    opt.url = opt.url || '';  
    opt.async = opt.async || true;  
    opt.data = opt.data || null;  
    opt.success = opt.success || function () {};  
    var xmlHttp = null;  
    if (XMLHttpRequest) {  
        xmlHttp = new XMLHttpRequest();  
    }  
    else {  
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');  
    }
    var params = [];  
    for (var key in opt.data){  
        params.push(key + '=' + opt.data[key]);  
    }  
    var postData = (params.length) ? ('?' +  params.join('&')) : '';  
    if (opt.method.toUpperCase() === 'POST') {  
        xmlHttp.open(opt.method, opt.url, opt.async);     
    }  
    else if (opt.method.toUpperCase() === 'GET') {  
        xmlHttp.open(opt.method, opt.url + postData, opt.async);
    } 
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=utf-8'); 
    xmlHttp.setRequestHeader('token', localStorage.token);
    xmlHttp.send(JSON.stringify(opt.data));   
    xmlHttp.onreadystatechange = function () {  
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {  
            opt.success(JSON.parse(xmlHttp.responseText));  
        }  
    };  
}

function formser(form){
    var form=document.getElementById(form);
    var arr={};
    for (var i = 0; i < form.elements.length; i++) {
        var feled=form.elements[i];
        switch(feled.type) {
            case undefined:
            case 'button':
            case 'file':
            case 'reset':
            case 'submit':
            break;
            case 'checkbox':
            case 'radio':
            if (!feled.checked) {
            break;
            }
            default:
            if (arr[feled.name]) {
            // arr[feled.name]=arr[feled.name]+','+feled.value;
                if(!Array.isArray(arr[feled.name])){
                    let old = [arr[feled.name]];
                    (feled.value.length) && old.push(feled.value);
                    arr[feled.name] = old;
                }else{
                    (feled.value.length) && arr[feled.name].push(feled.value);
                }
            }else{
                arr[feled.name]=feled.value;
            } 
        }
    }
    return arr;
    }