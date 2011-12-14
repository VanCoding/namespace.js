﻿﻿var fs = require("fs");
var modes = ["+","-"];

function build(mode,path,outputpath){
    var output = "(function(){";

	var search = [{path:path,namespace:""}];
	path = [].concat(path);
	for(var i = 0; i < path.length; i++){
		search.push({path:path[i],namespace:""});
	}
    var files = [];
    var namespaces = [];
	while(search.length){
		var nextsearch = [];
		for(var i = 0; i < search.length; i++){
			var s = search[i];
			var f = fs.readdirSync(s.path);
			for(var j = 0; j < f.length; j++){
				var real = f[j];
				var virtual = real;
				if(virtual[0] == mode || modes.indexOf(virtual[0]) == -1){
					for(var y = 0; y < modes.length; y++){
						if(virtual.indexOf(modes[y]) == 0){
							virtual = virtual.substr(modes[y].length);
							break;
						}
					}
					if(fs.statSync(s.path+f[j]).isFile()){		
						files.push(buildFile(s.path+real,s.namespace.substr(0,s.namespace.length-1),virtual.substr(0,virtual.length-3)));
					}else if(namespaces.indexOf(s.namespace+virtual) == -1){
						namespaces.push("try{"+s.namespace+virtual+".x;}catch(e){"+s.namespace+virtual+"={};}");
						nextsearch.push({path:s.path+real+"/",namespace:s.namespace+virtual+"."});
					}
				}
			}
		}
		search = nextsearch;
	}
    for(var i = 0; i < namespaces.length; i++){
        output += namespaces[i];
    }
    for(var i = 0; i < files.length; i++){
        output += files[i];
    }
	output += "})();";
    
    if(outputpath){
        fs.writeFileSync(outputpath,output);
    }    
	return output;
}

function buildFile(path,ns,name){
	var out = "";
	var f = (require("fs").readFileSync(path))+"";

	for(var i = 0; i < f.length && i >= 0;){
		switch(f.substr(i,2)){		
			case "//":
                for(;i < f.length; i++){
                    if(f[i] == "\r" || f[i] == "\n"){
                        i--;
                        break;
                    }
                }
				break;
			case "/*":
				i = f.indexOf("*/",i)+2;			
				break;
			default:
                var c = f[i++];
                out += c;
				if(c == "'" || c == '"' || c == "/"){
				    for(; i < f.length; i++){
				        if(f[i] == "\\"){                            
                            out += f[i];
                            i++;
				        }else if(f[i] == c){
				            break;
                        }else{
                            out += f[i];
                        }
                    }
                }
				break;
			
		}
	}

	var usings = [];
	var parts = out.split(";");
	out = ns.length?"with("+ns+")":"";
	for(var i = 0; i < parts.length; i++){
		var p = parts[i].search(/\S/);
		if(p == parts[i].indexOf("use")){
			var l = parts[i].substr(p+3);
		
			var p2 = l.search(/\S/)
			if(p2 >0 && p2 == l.search(/[a-zA-Z_$]/)){
				l = l.substr(p2);
				
				var last = l.search(/\s/);
				if(last>= 0){
					l = l.substr(0,last);
				}
				usings.push(l);
			}else{
				parts = parts.slice(i);
				break;
			}
		}else{
			parts = parts.slice(i);
			break;
		}
	}
    
	for(var i = 0; i < usings.length; i++){
		out += "with("+usings[i]+")";
	}
    
	out += "{"+ns+"."+name+"=(function(){";
	out += parts.join(";");
	out += ";return out;})();}";
    
	return out;
}



function buildAll(path,outpath){
	return build("",path,outpath);
}
buildAll.buildAll = buildAll;
buildAll.buildClient = function(path,outpath){
	return build("+",path,outpath);
}
buildAll.buildServer = function(path,outpath){
	return build("-",path,outpath);
}

module.exports = buildAll;

