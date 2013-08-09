var fs = require("fs");
var URL = require("url");
var path = require("path");
var http = require("http");

function includejs(file)
{
    var source = fs.readFileSync(file, "UTF-8");
    global.eval(source);
}

includejs("./lib/jstl-1.0.1.js");
includejs("./lib/jstl.taglib.js");
includejs("./lib/jstl.taglib.core.js");

/*
* express 3.x support
*/
exports.renderFile = function(path, options, fn)
{
	var key = path + ':func';

	console.log(path);
	if('function' == typeof options) 
	{
		fn = options, options = {};
	}

	var viewsMatch = path.match(/(views.*?)\w/i);
	var tmpId = path.split(viewsMatch[1]).pop();
	try 
	{
		//var context = "" + JSON.stringify(options);
			//var context = options;
			//var source = "Hello, ${this.user}";
    		//var scriptlet = jsp.runtime.JspRuntime.compile(source);
   			//var result = scriptlet.execute(context);
            //console.log(result);
			//fn(null,result);
			
		var context = options;
	
	    // c:each是c:forEach的简写, 都可以
	    var source = fs.readFileSync(path,'utf-8');
	    var page = source.replace(/\$\{/,'${this.');
	    console.log(page);
	    var scriptlet = jsp.runtime.JspRuntime.compile(page);
	    var result = scriptlet.execute(context);
	    //console.log(result);
	    fn(null,result);
	}
	catch(err) 
	{
		fn(err);
	}
};


exports.__express = exports.renderFile;

