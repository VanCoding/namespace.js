﻿var fs = require("fs");
var modes = ["+","-"];

function build(mode,path,outputpath){
    var output = "(function(){"+
		"function use(ns,name,f){"+
			"var s = {usings:[ns]};"+
			"use.h.push(s);"+
			"ns[name]=f.call(s,function(){"+
				"for(var i = 0; i < arguments.length; i++){"+
					"s.usings.push(arguments[i]);"+
				"}"+
				"return ns;"+
			"});"+
		"};"+
		"use.h=[];";

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
						files.push("use("+s.namespace.substr(0,s.namespace.length-1)+",'"+virtual.replace(".js","")+"',function(use){"+
							"with(this){"+
								"return (function(){"+
									fs.readFileSync(s.path+real)+"\r\n"+
									"return out;"+
								"})();"+
							"}"+
						"});");
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
	output += 
		"(function(){"+
			"for(var i = 0; i < use.h.length; i++){"+
				"var u = use.h[i].usings;"+
				"for(var j = 0; j < u.length; j++){"+
					"for(var a in u[j]){"+
						"use.h[i][a] = u[j][a];"+
					"}"+
				"}"+
			"}"+
		"})();"+
	"})();";
    
    if(outputpath){
        fs.writeFileSync(outputpath,output);
    }    
	return output;
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

