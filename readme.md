Namespace.js
========================
This is a library allows you to create good structured javascript frameworks.

Features
------------------------
- Folder-based namespacing
- "use" functionality that behaves like "using" of C# or "import" of Java
- compiling multiple libraries to one file
- prefixes to mark a file or namespace as "client-only" (+) or "server-only" (-) 


Example libraries
------------------------
There will be some senseless exmaple libraries in the future. They will help you
understand how the system works.

Just check out the "examples" folder.

How to use
====================

Simple library
-
    var sourcedir = "/mymodule/src/"; //path to the directory that contains your library
    var outputfile = "/mymodule/build/mymodule.js"; //the path whre your compiled library should be saved
    var ns = require("namespace.js"); //load namespace.js

    ns.buildAll(sourcedir,outputfile); //build the library

Merge multiple libaries to one file
-
    var sourcedirs = ["/myfirstmodule/src/","/mysecondmodule/src/"]; // just put all library paths into an array
    var outputfile = "/build.js";

    require("namespace.js").buildAll(sourcedirs,outputfile);

Only bulid client-only or server-only code
-

client-only code includes all namespaces & files that are prefixed with "+", or don't have a prefix.

- /src/util/mixin.js -> included
- /src/util/+mixin.js -> included
- /src/+util/mixin.js -> included
- /src/util/-mixin.js -> not included
- /src/-util/+mixin.js -> NOT included, since the namespace is not included

~~~
require("namespace.js").buildClient("/src/","/build.js");
~~~

server-only code includes all namespaces & files that are prefixed with "-", or don't have a prefix.

- /src/util/mixin.js -> included
- /src/util/-mixin.js -> included
- /src/-util/mixin.js -> included
- /src/util/+mixin.js -> not included
- /src/+util/-mixin.js -> NOT included, since the namespace is not included

~~~
require("namespace.js").buildServer("/src/","/build.js");
~~~
