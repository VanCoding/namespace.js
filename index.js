var fs = require("fs");
function build(path,outputpath){
    var output = "(function(){"+
		"function use(){"+
			"if(!this.done){"+
				"for(var i = 0; i < arguments.length; i++){"+
					"var obj = arguments[i];"+
					"for(var a in obj){"+
						"this[a] = arguments[i][a];"+
					"}"+
				"}"+
				"this.done = true;"+
			"}"+
		"};"+
		"function m(s,p){"+
			"h.push([s,p]);"+
			"return function(){use.apply(s,Array.prototype.slice.call(arguments,0));}"+
		"}"+
		"var h=[],c;";

	var search = [{path:path,namespace:""}];
	while(search.length){
		var nextsearch = [];
		for(var i = 0; i < search.length; i++){
			var s = search[i];
			var f = fs.readdirSync(s.path);
			for(var j = 0; j < f.length; j++){
				if(fs.statSync(s.path+f[j]).isFile()){
					output += "c="+s.namespace.substr(0,s.namespace.length-1)+";"+
					"c."+f[j].replace(".js","")+"=(function(){"+					
						"with({}){"+
							"var use=m(this,c);"+
							fs.readFileSync(s.path+f[j])+"\r\n"+
							"return out;"+
						"}"+
					"})();";
				}else{
					output += "if(!this."+s.namespace+f[j]+"){"+s.namespace+f[j]+"={};}";
					nextsearch.push({path:s.path+f[j]+"/",namespace:s.namespace+f[j]+"."});
				}
			}
		}
		search = nextsearch;
	}
	output += 
		"for(var i = 0; i < h.length; i++){"+
			"for(var a in h[i][1]){"+
				"h[i][0][a] = h[i][1][a];"+
			"}"+
		"}"+
	"})();";
    
    if(outputpath){
        fs.writeFileSync(outputpath,output);
    }    
	return output;

}
module.exports = build;

