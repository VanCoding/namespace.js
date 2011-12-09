﻿var fs = require("fs");
function build(path,outputpath){
    var output = "(function(){"+
		"function use(ns,name,f){"+
			"var s = {usings:[ns]};"+
			"use.h.push(s);"+
			"ns[name]=f.call(s,function(){"+
				"for(var i = 0; i < arguments.length; i++){"+
					"s.usings.push(arguments[i]);"+
				"}"+
			"});"+
		"};"+
		"use.h=[];";

	var search = [{path:path,namespace:""}];
    var files = [];
    var namespaces = [];
	while(search.length){
		var nextsearch = [];
		for(var i = 0; i < search.length; i++){
			var s = search[i];
			var f = fs.readdirSync(s.path);
			for(var j = 0; j < f.length; j++){
				if(fs.statSync(s.path+f[j]).isFile()){
					files.push("use("+s.namespace.substr(0,s.namespace.length-1)+",'"+f[j].replace(".js","")+"',function(use){"+
						"with(this){"+
							"return (function(){"+
								fs.readFileSync(s.path+f[j])+"\r\n"+
								"return out;"+
							"})();"+
						"}"+
					"});");
				}else{
					namespaces.push("try{"+s.namespace+f[j]+".x;}catch(e){"+s.namespace+f[j]+"={};}");
					nextsearch.push({path:s.path+f[j]+"/",namespace:s.namespace+f[j]+"."});
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
module.exports = build;

