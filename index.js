var fs = require("fs");
function build(path,outputpath){
    var output = "(function(){"+
		"function use(){"+
			"for(var i = 0; i < arguments.length; i++){"+
				"var obj = arguments[i];"+
				"this.__usings.push(obj);"+
			"}"+
		"};"+
		"function m(s,p){"+
			"h.push(s);"+
			"s.__usings = [p];"+
			"return function(){use.apply(s,Array.prototype.slice.call(arguments,0));}"+
		"}"+
		"var h=[],c;";

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
					files.push("c="+s.namespace.substr(0,s.namespace.length-1)+";"+
					"c."+f[j].replace(".js","")+"=new function(){"+	
						"with(this){"+
							"var use=m(this,c);"+
							"return (function(){"+
								fs.readFileSync(s.path+f[j])+"\r\n"+
								"return out;"+
							"})();"+
						"}"+
					"};");
				}else{
					namespaces.push("if(!this."+s.namespace+f[j]+"){"+s.namespace+f[j]+"={};}");
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
		"for(var i = 0; i < h.length; i++){"+
			"var u = h[i].__usings;"+
			"for(var j = 0; j < u.length; j++){"+
				"for(var a in u[j]){"+
					"h[i][a] = u[j][a];"+
				"}"+
			"}"+
		"}"+
	"})();";
    
    if(outputpath){
        fs.writeFileSync(outputpath,output);
    }    
	return output;

}
module.exports = build;

