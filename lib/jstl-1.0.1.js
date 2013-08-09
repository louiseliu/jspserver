(function(){
    /*
     * $RCSfile: Package.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    if(typeof(Package) == "undefined")
    {
        Package = {};
    }

    /**
     * create package object
     * var com = Package.create("com.test1.test1"); // will return {"test1": {"test1": {}}};
     * logger.debug(com.test1.test1.packageName);
     * @param name
     * @return Object
     */
    Package.create = function(name){
        var a = name.split(".");

        if(a.length < 1)
        {
            return {};
        }

        var p = {};
        var object = p;

        for(var i = 1; i < a.length; i++)
        {
            p = p[a[i]] = {"packageName": a[i]};
        }

        return object;
    };

    /*
     * $RCSfile: Class.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    if(typeof(Class) == "undefined")
    {
        Class = {};
    }

    /**
     * create a class
     * function Animal(){
     *     this.move = function(){logger.debug("move");};
     *     logger.debug("I am great !");
     * };
     * var Duck = Class.create(Animal, function(){
     *    this.swim = function(){
     *        logger.debug("help! help!");
     *    };
     *    logger.debug("I am very great !");
     * });
     * var myduck = new Duck();
     * myduck.move();
     * myduck.swim();
     * will print:
     * I am great !
     * I am very great !
     * move
     * help! help!
     * @param parent
     * @param constructor
     * @return Object
     */
    Class.create = function(parent, constructor){
        var clazz = null;

        if(parent != null)
        {
            if(constructor != null)
            {
                clazz = function(){/* Class.create */ parent.apply(this, arguments); this.$super = Class.$super(this, parent.prototype); constructor.apply(this, arguments);};
            }
            else
            {
                clazz = function(){/* Class.create */ parent.apply(this, arguments); this.$super = Class.$super(this, parent.prototype);};
            }

            for(var property in parent.prototype)
            {
                clazz.prototype[property] = parent.prototype[property];
            }
        }
        else
        {
            if(constructor != null)
            {
                clazz = function(){/* Class.create */ this.$super = {}; constructor.apply(this, arguments);};
            }
            else
            {
                clazz = function(){/* Class.create */ this.$super = {};};
            }
        }

        return (clazz.prototype.constructor = clazz);
    };

    /**
     * @param prototype
     * @param instance
     * @retur Object
     */
    Class.$super = /* private */ function(instance, prototype){
        var object = {};

        for(var i in prototype)
        {
            if(typeof(prototype[i]) == "function")
            {
                object[i] = function(){prototype[i].apply(instance, arguments);};
            }
        }

        return object;
    };

    /**
     * simple singleton
     * var myduck = Class.getInstance(Animal, function(){this.swim = function(){};});
     * myduck.swim();
     * @param parent
     * @param constructor
     * @return Object
     */
    Class.getInstance = function(parent, constructor){
        return new (Class.create(parent, constructor))();
    };

    /**
     * extend properties
     * @param child
     * @param parent
     * @return Object
     */
    Class.extend = function(child, parent){
        if(child == null)
        {
            child = {};
        }

        for(var property in parent)
        {
            child[property] = parent[property];
        }

        return child;
    };
})();

var com = (function(){
    var com = {};
    com.skin = {};
    com.skin.jsp = {};
    com.skin.jsp.compile = {};
    com.skin.log = {};
    com.skin.log.logger = {};
    com.skin.html = {};
    com.skin.util = {};

    var logger = com.skin.log.logger;

    logger.write = function(content){
        /* WScript.echo(content); */
    };

    logger.log = function(){
        var content = null;
        var length = arguments.length;

        if(length < 1)
        {
            content = "null";
        }
        else if(length == 1)
        {
            content = arguments[0];
        }
        else if(length > 1)
        {
            var buffer = [];

            for(var i = 0; i < arguments.length; i++)
            {
                buffer.push(arguments[i]);
            }

            content = buffer.join("");
        }

        this.write(content);
    };

    logger.info = function(){
        logger.log.apply(logger, arguments);
    };

    logger.debug = function(){
        logger.log.apply(logger, arguments);
    };

    return com;
})();

(function(){
    /*
     * $RCSfile: StringUtil.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var StringUtil = com.skin.util.StringUtil = {};

    StringUtil.isISOControl = function(c){
        return (c == "\r" || c == "\n" || c == "\t" || c == "\b" || c == "\f");
    };

    /**
     * @param c
     * @return boolean
     */
    StringUtil.isLetter = function(c){
        var i = c.charCodeAt(0);
        return (i >= 97 && i <= 122) || (i >= 65 && i <= 97);
    };

    /**
     * @param c
     * @return boolean
     */
    StringUtil.isDigit = function(c){
        var i = c.charCodeAt(0);
        return (i >= 48 && i <= 57);
    };

    /**
     * @param source
     * @return boolean
     */
    StringUtil.trim = function(source){return (source != null ? source.replace(/(^\s*)|(\s*$)/g, "") : "");};

    /**
     * @param source
     * @return boolean
     */
    StringUtil.startsWith = function(source, search){
        if(source.length >= search.length)
        {
            return (source.substring(0, search.length) == search);
        }

        return false;
    };

    /**
     * @param source
     * @return boolean
     */
    StringUtil.endsWith = function(source, search){
        if(source.length >= search.length)
        {
            return (source.substring(source.length - search.length) == search);
        }

        return false;
    };

    /**
     * @param source
     * @param context
     * @return String
     */
    StringUtil.replace = function(source, context){
        var c = null;
        var result = [];

        for(var i = 0, length = source.length; i < length; i++)
        {
            c = source.charAt(i);

            if(c == "$" && i < length - 1 && source.charAt(i + 1) == "{")
            {
                var buffer = [];

                for(var j = i + 2; j < length; j++)
                {
                    i = j;
                    c = source.charAt(j);

                    if(c == "}")
                    {
                        var value = context.getValue(buffer.join(""));

                        if(value != null)
                        {
                            result.push(value.toString());
                        }

                        break;
                    }
                    else
                    {
                        buffer.push(c);
                    }
                }
            }
            else
            {
                result.push(c);
            }
        }

        return result;
    };

    /**
     * @param source
     * @return String
     */
    StringUtil.text = function(source){
        if(source == null)
        {
            return "";
        }

        var c = null;
        var buffer = [];

        for(var i = 0, length = source.length; i < length; i++)
        {
            c = source.charAt(i);

            switch (c)
            {
                case "\\":
                {
                    buffer.push("\\\\"); break;
                }
                case "\'":
                {
                    buffer.push("\\\'"); break;
                }
                case "\"":
                {
                    buffer.push("\\\""); break;
                }
                case "\r":
                {
                    buffer.push("\\r"); break;
                }
                case "\n":
                {
                    buffer.push("\\n"); break;
                }
                case "\t":
                {
                    buffer.push("\\t"); break;
                }
                case "\b":
                {
                    buffer.push("\\b"); break;
                }
                case "\f":
                {
                    buffer.push("\\f"); break;
                }
                default :
                {
                    buffer.push(c); break;
                }
            }
        }

        return buffer.join("");
    };

    var DateFormat = com.skin.util.DateFormat = {};

    DateFormat.format = function(date, pattern){
        if(date == null)
        {
            return "";
        }

        var dateTime = this.toString(date);

        var cs = ["y", "M", "d", "H", "m", "s", "S"];
        var fs = pattern.split("");
        var ds = dateTime.split("");

        var y = 3;
        var M = 6;
        var d = 9;
        var H = 12;
        var m = 15;
        var s = 18;
        var S = 22;

        for(var i = fs.length - 1; i > -1; i--)
        {
            switch (fs[i])
            {
                case cs[0]:
                {
                    fs[i] = ds[y--];
                    break;
                }
                case cs[1]:
                {
                    fs[i] = ds[M--];
                    break;
                }
                case cs[2]:
                {
                    fs[i] = ds[d--];
                    break;
                }
                case cs[3]:
                {
                    fs[i] = ds[H--];
                    break;
                }
                case cs[4]:
                {
                    fs[i] = ds[m--];
                    break;
                }
                case cs[5]:
                {
                    fs[i] = ds[s--];
                    break;
                }
                case cs[6]:
                {
                    fs[i] = ds[S--];
                    break;
                }
            }
        }

        return fs.join("");
    };

    DateFormat.toString = function(date){
        if(date == null)
        {
            return "";
        }

        var y = date.getFullYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var S = date.getTime() % 1000;

        var a = [];

        a[a.length] = y.toString();
        a[a.length] = "-";

        if(M < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = M.toString();
        a[a.length] = "-";

        if(d < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = d.toString();

        a[a.length] = " ";
        
        if(h < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = h.toString();
        a[a.length] = ":";

        if(m < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = m.toString();
        a[a.length] = ":";

        if(s < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = s.toString();
        a[a.length] = " ";

        if(S < 100)
        {
            a[a.length] = "0";
        }

        if(S < 10)
        {
            a[a.length] = "0";
        }

        a[a.length] = S.toString();
        return a.join("");
    };

    /*
     * $RCSfile: HtmlUtil,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var HtmlUtil = com.skin.util.HtmlUtil = {};

    /**
     * @param source
     * @param crlf
     * @return String
     */
    HtmlUtil.encode = function(source, crlf){
        if(source == null)
        {
            return "";
        }

        if(crlf == null || crlf == undefined)
        {
            crlf = "\n";
        }

        var c;
        var buffer = [];

        for(var i = 0, length = source.length; i < length; i++)
        {
            c = source.charAt(i);

            switch (c)
            {
                case "&":
                {
                    buffer.push("&amp;");
                    break;
                }
                case "\"":
                {
                    buffer.push("&quot;");
                    break;
                }
                case "<":
                {
                    buffer.push("&lt;");
                    break;
                }
                case ">":
                {
                    buffer.push("&gt;");
                    break;
                }
                case "\r":
                {
                    if((i + 1) < size)
                    {
                        if(source.charAt(i + 1) == "\n")
                        {
                            buffer.push(crlf);
                            i++;
                        }
                        else
                        {
                            buffer.push(c);
                        }
                    }
                    else
                    {
                        buffer.push(c);
                    }

                    break;
                }
                case "\n":
                {
                    buffer.push(crlf);
                    break;
                }
                default :
                {
                    buffer.push(c);
                    break;
                }
            }
        }

        return buffer.join("");
    };

    /*
     * $RCSfile: Stack.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Stack = com.skin.util.Stack = function(){
        this.stack = [];
    };

    /**
     * @param e
     */
    Stack.prototype.push = function(e){
        this.stack.push(e);
    };

    /**
     * @return Object
     */
    Stack.prototype.pop = function(){
        var e = this.poll();

        if(e == null)
        {
            throw new {"name": "IllegalStateException", "message": "IllegalStateException"};
        }

        return e;
    };

    /**
     * @return Object
     */
    Stack.prototype.poll = function(){
        var index = this.stack.length;

        if(index > 0)
        {
            var e = this.stack[index - 1];
            this.stack.length = index - 1;
            return e;
        }

        return null;
    };

    /**
     * @param i
     * @return Object
     */
    Stack.prototype.peek = function(i){
        if(i == null)
        {
            i = -1;
        }

        var index = this.stack.length;

        if((index + i) >= 0 && (index + i) < index)
        {
            return this.stack[index + i];
        }

        return null;
    };

    /**
     * @param i
     * @return Object
     */
    Stack.prototype.element = function(i){
        if(i > -1 && i < this.stack.length)
        {
            return this.stack[i];
        }

        return null;
    };

    /**
     * @return int
     */
    Stack.prototype.size = function(){
        return this.stack.length;
    };

    /**
     * @return String
     */
    Stack.prototype.getTrace = function(){
        var buffer = [];
        buffer.push("**** stack ****\r\n");

        for(var i = this.stack.length - 1; i > -1; i--)
        {
            var l = i;
            var e = this.stack[i];

            if(i < 10)
            {
                l = "   " + i;
            }
            else if(i < 100)
            {
                l = "  " + i;
            }
            else if(i < 1000)
            {
                l = " " + i;
            }

            buffer.push(l + " -> ");

            if(typeof(e) == "object")
            {
                for(var n in e)
                {
                    buffer.push(n + ": " + e[n]);
                    buffer.push(", ");
                }
            }
            else
            {
                buffer.push(e);
            }

            buffer.push("\r\n");
        }

        return buffer.join("");
    };

    /**
     * @return String
     */
    Stack.prototype.toString = function(){
        return this.getTrace();
    };

    /*
     * $RCSfile: Stack.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var StringWriter = com.skin.util.StringWriter = function(){
        this.buffer = [];
    };

    /**
     * @param source
     */
    StringWriter.prototype.write = function(source){
        this.buffer.push(source);
    };

    /**
     * 
     */
    StringWriter.prototype.flush = function(){};

    /**
     * @return String
     */
    StringWriter.prototype.toString = function(){
        return this.buffer.join("\r\n");
    };
})();

(function(){
    var StringUtil = com.skin.util.StringUtil;

    /*
     * $RCSfile: HtmlStream.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var HtmlStream = com.skin.html.HtmlStream = function(source){
        this.position = 0;
        this.length = source.length;
        this.buffer = source;
        this.closed = false;
    };

    /**
     * @param length
     */
    HtmlStream.prototype.back = function(length){
        if(length == null)
        {
            length = 1;
        }

        if(length < 1)
        {
            return 0;
        }

        var len = (length > this.position ? this.position : length);
        this.position -= len;

        return len;
    };

    /**
     * @param offset
     * @return char
     */
    HtmlStream.prototype.peek = function(offset){
        if(this.position < this.length)
        {
            if(offset != null)
            {
                return this.buffer.charAt(this.position + offset);
            }
            else
            {
                return this.buffer.charAt(this.position);
            }
        }

        return -1;
    };

    /**
     * @param cbuf
     * @param offset
     * @param length
     * @return int
     */
    HtmlStream.prototype.read = function(cbuf, offset, length){
        if(this.closed == true)
        {
            throw {"name": "IOException", "message": "stream is closed !"};
        }

        if(cbuf == null)
        {
            if(this.position < this.length)
            {
                return this.buffer.charAt(this.position++);
            }

            return -1;
        }

        if(offset == null)
        {
            offset = 0;
        }

        if(length == null)
        {
            length = cbuf.length;
        }

        var size = Math.min(this.length - this.position, length);

        if(size > 0)
        {
            for(var i = 0; i < length; i++)
            {
                cbuf[offset + i] = this.buffer.charAt(this.position++);
            }
        }
        else
        {
            size = -1;
        }

        return size;
    };

    /**
     * @param test
     * @return String
     */
    HtmlStream.prototype.tryread = function(test){
        var size = test.length;

        if((this.length - this.position) >= size)
        {
            var i = this.position;

            for(var j = 0; j < size; i++, j++)
            {
                if(this.buffer.charAt(i) != test.charAt(j))
                {
                    return -1;
                }
            }

            this.position += size;
            return this.buffer.substring(i - size, i);
        }

        return -1;
    };

    /**
     * @param position
     */
    HtmlStream.prototype.setPosition = function(position){
        this.position = position;
    };

    /**
     * @return int
     */
    HtmlStream.prototype.getPosition = function(){
        return this.position;
    };

    /**
     * @param cbuf
     * @param offset
     * @param length
     */
    HtmlStream.prototype.write = function(cbuf, offset, length){
        if(this.closed)
        {
            throw {"name": "RuntimeException", "message": "stream is closed !"};
        }

        throw {"name": "UnsupportedOperationException", "message:": "The 'write' method is Unsupported!"};
    };

    /**
     * @param position
     */
    HtmlStream.prototype.setPosition = function(position){
        this.position = position;
    };

    /**
     * @return int
     */
    HtmlStream.prototype.getPosition = function(){
        return this.position;
    };

    /**
     * @return int
     */
    HtmlStream.prototype.length = function(){
        return this.length;
    };

    /**
     * close stream
     */
    HtmlStream.prototype.close = function(){
        this.closed = true;
    };

    /*
     * $RCSfile: HtmlParser.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var HtmlParser = com.skin.html.HtmlParser = function(){};

    /**
     * @see com.skin.html.HtmlParser
     */
    HtmlParser.prototype.parse = function(){
    };

    /**
     * read node name, after read '<'
     * @return String
     */
    HtmlParser.prototype.getNodeName = function(){
        var c;
        var buffer = [];
        while((c = this.stream.read()) != -1)
        {
            if(StringUtil.isLetter(c) || StringUtil.isDigit(c) || c == ":" || c == "-" || c == "_")
            {
                buffer.push(c);
            }
            else
            {
                break;
            }
        }

        this.stream.back();

        return buffer.join("");
    };

    /**
     * read node name, after read nodeName
     * @return String
     */
    HtmlParser.prototype.getAttributes = function(){
        var c;
        var name = null;
        var value = null;
        var buffer = [];
        var attributes = {};

        while((c = this.stream.peek()) != ">" && c != "/" && c != -1)
        {
            // skip space
            while((c = this.stream.read()) != -1)
            {
                if(c != " ")
                {
                    this.stream.back();
                    break;
                }
            }

            // read name
            while((c = this.stream.read()) != -1)
            {
                if(StringUtil.isLetter(c) || StringUtil.isDigit(c) || c == ":" || c == "-" || c == "_")
                {
                    buffer.push(c);
                }
                else
                {
                    this.stream.back();
                    break;
                }
            }

            name = buffer.join("");
            buffer.length = 0;

            if(name.length < 1)
            {
                continue;
            }

            // skip space
            while((c = this.stream.read()) != -1)
            {
                if(c != " ")
                {
                    this.stream.back();
                    break;
                }
            }

            // next character must be '='
            if(this.stream.peek() != "=")
            {
                attributes[name] = "";
                continue;
            }
            else
            {
                this.stream.read();
            }

            // skip space
            while((c = this.stream.read()) != -1)
            {
                if(c != " ")
                {
                    break;
                }
            }

            var quote = " ";

            if(c == "\"")
            {
                quote = "\"";
            }
            else if(c == "'")
            {
                quote = "'";
            }

            if(quote == " ")
            {
                while((c = this.stream.read()) != -1)
                {
                    if(c == " " || c == ">")
                    {
                        break;
                    }
                    else if(c == "/" && this.stream.peek() == ">")
                    {
                        break;
                    }
                    else
                    {
                        buffer.push(c);
                    }
                }
            }
            else
            {
                while((c = this.stream.read()) != -1)
                {
                    if(c != quote)
                    {
                        buffer.push(c);
                    }
                    else
                    {
                        break;
                    }
                }
            }

            value = buffer.join("");
            attributes[name] = value;
            buffer.length = 0;
        }

        return attributes;
    };
})();

(function(){
    if(typeof(jsp) == "undefined")
    {
        jsp = {"scriptlet": {}, "compile": {}, "runtime": {}, "el": {}};
    }

    var StringUtil = com.skin.util.StringUtil;

    /*
     * $RCSfile: ExpressionPool,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.compile.ExpressionPool = function(){
        this.index = 0;
        this.pool = [];
    };

    /**
     * @param source
     * @return jsp.el.Expression
     */
    jsp.compile.ExpressionPool.prototype.parse = function(source){
        source = StringUtil.trim(source);
		
		
        if(StringUtil.startsWith(source, "${") && StringUtil.endsWith(source, "}"))
        {
            source = source.substring(2, source.length - 1);
        }
        else
        {
            var c = null;
            var result = [];
            var buffer = [];

            for(var i = 0, length = source.length; i < length; i++)
            {
                c = source.charAt(i);

                if(c == "$" && i < length - 1 && source.charAt(i + 1) == "{")
                {
                    var temp = [];

                    for(var j = i + 2; j < length; j++)
                    {
                        i = j;
                        c = source.charAt(j);

                        if(c == "}")
                        {
                            if(buffer.length > 0)
                            {
                                result.push("\\\"" + StringUtil.text(buffer.join("")) + "\\\"");
                                buffer.length = 0;
                            }

                            var expr = this.create(temp.join(""));
                            result.push("this." + expr.name + "(this)");
                            break;
                        }
                        else
                        {
                            temp.push(c);
                        }
                    }
                }
                else
                {
                    buffer.push(c);
                }
            }

            if(buffer.length > 0)
            {
                result.push("\\\"" + StringUtil.text(buffer.join("")) + "\\\"");
                buffer.length = 0;
            }

            return this.create(result.join(" + "));
        }

        var name = "_expr_" + (this.index++);
        var expr = new jsp.el.Expression(name, source);
        this.pool.push(expr);
        return expr;
    };

    /**
     * @param source
     * @return jsp.el.Expression
     */
    jsp.compile.ExpressionPool.prototype.create = function(source){
        source = StringUtil.trim(source);
        if(StringUtil.startsWith(source, "${") && StringUtil.endsWith(source, "}"))
        {
            source = source.substring(2, source.length - 1);
        }

        var name = "_expr_" + (this.index++);
        var expr = new jsp.el.Expression(name, source);
        this.pool.push(expr);
        return expr;
    };

    /**
     * build variable list
     * @return String
     */
    jsp.compile.ExpressionPool.prototype.getVariableList = function(){
        var buffer = [];

        for(var i = 0; i < this.pool.length; i++)
        {
            buffer.push("this." + this.pool[i].name + " = new jsp.el.Expression(\"" + this.pool[i].name + "\", \"" + this.pool[i].expression + "\");");
        }
		
        return buffer.join("\r\n");
    };

    /**
     * build function list
     * @return String
     */
    jsp.compile.ExpressionPool.prototype.getFunctionList = function(){
        var buffer = [];

        buffer.push("new (function(){");

        for(var i = 0; i < this.pool.length; i++)
        {
            buffer.push("    this." + this.pool[i].name + " = function(){ return (" + this.pool[i].expression + "); };");
        }

        buffer.push("})()");
        return buffer.join("\r\n");
    };

    /**
     * build expression array
     * @return String
     */
    jsp.compile.ExpressionPool.prototype.getExprTable = function(){
        var buffer = [];
        buffer.push("[");

        for(var i = 0; i < this.pool.length; i++)
        {
            if((i + 1) < this.pool.length)
            {
                buffer.push("    this." + this.pool[i].name + ",");
            }
            else
            {
                buffer.push("    this." + this.pool[i].name);
            }
        }

        buffer.push("]");
        return buffer.join("\r\n");
    };

    /**
     * dump expression pool
     * @return String
     */
    jsp.compile.ExpressionPool.prototype.toString = function(){
        var buffer = [];

        buffer.push("[");

        for(var i = 0; i < this.pool.length; i++)
        {
            if((i + 1) < this.pool.length)
            {
                buffer.push("    {\"name\": \"" + this.pool[i].name + "\", \"expression\": \"" + this.pool[i].expression + "\"},");
            }
            else
            {
                buffer.push("    {\"name\": \"" + this.pool[i].name + "\", \"expression\": \"" + this.pool[i].expression + "\"}");
            }
        }
        buffer.push("]");

        return buffer.join("\r\n");
    };

    /*
     * $RCSfile: JspCompiler,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.compile.JspCompiler = Class.create(com.skin.html.HtmlParser);

    /**
     * @return String
     */
    jsp.compile.JspCompiler.prototype.compile = function(source, template){
        this.template = template;
        return this.parse(source);
    };

    /**
     * @return String
     */
    jsp.compile.JspCompiler.prototype.parse = function(source){
        var c = null;
        this.flagIndex = 0;
        this.tempIndex = 0;
        this.tagInstanceIndex = 0;
        this.exprIndex = 0;
        this.tagLibrary = jsp.runtime.JspRuntime.getTagLibrary();
        this.exprPool = new jsp.compile.ExpressionPool();

        this.stack  = new com.skin.util.Stack();
        this.stream = new com.skin.html.HtmlStream(source);
        this.writer = new com.skin.util.StringWriter();
        this.buffer = new com.skin.util.StringWriter();
        this.buffer.flush = function(){
            if(this.buffer.length > 0){
                this.writer.write("    out.write(\"" + StringUtil.text(this.buffer.join("")) + "\");");
                this.buffer.length = 0;
            }
        };

        this.buffer.writer = this.writer;

        while((c = this.stream.read()) != -1)
        {
            if(c == "<")
            {
                this.startTag();
            }
            else if(c == "$" && this.stream.peek() == "{")
            {
                c = this.stream.read();
                var expression = [];

                while((c = this.stream.read()) != -1)
                {
                    if(c == "}")
                    {
                        var expr = this.exprPool.create(expression.join(""));
						console.log("expr:" + JSON.stringify(expr));	
                        this.buffer.flush();
                        this.writer.write("    this." + expr.name + ".write(out, pageContext);");
                        break;
                    }
                    else
                    {
                        expression.push(c);
                    }
                }
            }
            else
            {
                this.buffer.write(c);
            }
        }

        this.buffer.flush();
        this.writer.write("    this.release();");

        var script = this.template.replace("${METHOD_BODY}", this.writer.toString());
		
        var a = [];
        a.push(this.exprPool.getVariableList());
        a.push("this.exprPool = " + this.exprPool.getExprTable() + ";");
        a.push("this.exprList = null;");
        script = script.replace("${DECLARE_BODY}", a.join(""));

        return script;
    };

    /**
     *
     */
    jsp.compile.JspCompiler.prototype.startTag = function(){
        var c = null;
        var stack = this.stack;
        var stream = this.stream;
        var tagLibrary = this.tagLibrary;

        // scriptlet
        if(stream.peek() == "%")
        {
            c = stream.read();

            this.buffer.flush();
            this.startScriptlet();
        }
        // end tag
        else if(stream.peek() == "/")
        {
            stream.read();
            var nodeName = this.getNodeName();

            if(stream.peek() == ">")
            {
                stream.read();
            }

            this.endTag(nodeName);
        }
        else if(this.stream.peek() != "!")
        {
            var nodeName = this.getNodeName();

            if(tagLibrary != null && tagLibrary.getTagClassName(nodeName) != null)
            {
                var tagClassName = tagLibrary.getTagClassName(nodeName);
                var parent = stack.peek();
                var flagName = "_flag_" + (this.flagIndex++);
                var tagInstanceName = "_tag_instance_" + (this.tagInstanceIndex++);
                var tagInfo = {"className": tagClassName, "instanceName": tagInstanceName, "flagName": flagName};
                stack.push(tagInfo);
                var attributes = this.getAttributes(stream);

                if(stream.peek() == ">")
                {
                    stream.read();
                }

                this.buffer.flush();

                if(tagClassName == "jsp.taglib.core.IfTag")
                {
                    var expr = this.exprPool.create(attributes["test"]);
                    this.writer.write("if(this." + expr.name + ".getBoolean(pageContext)){");
                }
                else if(tagClassName == "jsp.taglib.core.SetTag")
                {
                    var name = attributes["var"];
                    var expr = this.exprPool.parse(attributes["value"]);
                    this.writer.write("pageContext.setAttribute(\"" + name + "\", this." + expr.name + ".getValue(pageContext));");
                }
                else if(tagClassName == "jsp.taglib.core.OutTag")
                {
                    var expr = this.exprPool.parse(attributes["value"]);
                    this.writer.write("var " + tagInstanceName + " = new " + tagClassName + "();");
                    this.writer.write(tagInstanceName + ".setPageContext(pageContext);");
                    this.writer.write(tagInstanceName + ".setValue(this." + expr.name + ".getValue(pageContext));");

                    if(attributes["escapeXml"] == "true")
                    {
                        this.writer.write(tagInstanceName + ".setEscapeXml(true);");
                    }

                    this.writer.write(tagInstanceName + ".doStartTag();");

                    // if instance of BodyContent
                    this.writer.write("out = out.pushBody();");
                    this.writer.write(tagInstanceName + ".setBodyContent(out);");
                }
                else if(tagClassName == "jsp.taglib.core.ForEachTag")
                {
                    var items = attributes["items"];
                    var variable = attributes["var"];

                    this.writer.write("var " + tagInstanceName + " = new " + tagClassName + "();");

                    if(parent != null)
                    {
                        this.writer.write(tagInstanceName + ".setParent(" + parent.instanceName + ");");
                    }

                    if(variable != null)
                    {
                        tagInfo.eachVarName = variable;
                        tagInfo.tempObjectName = "_temp_object_" + (this.tempIndex++);
                    }

                    this.writer.write(tagInstanceName + ".setPageContext(pageContext);");

                    if(items != null)
                    {
                        var expr = this.exprPool.parse(items);
                        this.writer.write(tagInstanceName + ".setItems(this." + expr.name + ".getValue(pageContext));");
                    }

                    if(attributes["begin"] != null)
                    {
                        var expr = this.exprPool.create(attributes["begin"]);
                        this.writer.write(tagInstanceName + ".setBegin(this." + expr.name + ".getValue(pageContext));");
                    }

                    if(attributes["step"] != null)
                    {
                        var expr = this.exprPool.create(attributes["step"]);
                        this.writer.write(tagInstanceName + ".setStep(this." + expr.name + ".getValue(pageContext));");
                    }

                    if(attributes["end"] != null)
                    {
                        var expr = this.exprPool.create(attributes["end"]);
                        this.writer.write(tagInstanceName + ".setEnd(this." + expr.name + ".getValue(pageContext));");
                    }

                    if(attributes["varStatus"] != null)
                    {
                        this.writer.write("pageContext.setAttribute(\"" + attributes["varStatus"] + "\", " + tagInstanceName + ".loopTagStatus);");
                    }

                    if(variable != null)
                    {
                        this.writer.write("var " + tagInfo.tempObjectName+ " = pageContext.getAttribute(\"" + variable + "\");");
                    }

                    this.writer.write(tagInstanceName + ".doStartTag();");
                    this.writer.write("while(" + tagInstanceName + ".hasNext()){");
                    this.writer.write("    pageContext.setAttribute(\"" + variable + "\", " + tagInstanceName + ".next());");
                }
                else if(tagClassName == "jsp.taglib.core.ChooseTag")
                {
                    this.writer.write("var " + tagInstanceName + " = new " + tagClassName + "();");

                    if(parent != null)
                    {
                        this.writer.write(tagInstanceName + ".setParent(" + parent.instanceName + ");");
                    }

                    this.writer.write(tagInstanceName + ".setPageContext(pageContext);");
                }
                else if(tagClassName == "jsp.taglib.core.WhenTag")
                {
                    var expr = this.exprPool.create(attributes["test"]);
                    this.writer.write("if(" + parent.instanceName + ".complete() == false && this." + expr.name + ".getBoolean(pageContext)){");
                    this.writer.write("    " + parent.instanceName + ".finish();");
                }
                else if(tagClassName == "jsp.taglib.core.OtherwiseTag")
                {
                    this.writer.write("if(" + parent.instanceName + ".complete() == false){");
                    this.writer.write("    " + parent.instanceName + ".finish();");
                }
                else
                {
                    this.writer.write("var " + tagInstanceName + " = new " + tagClassName + "();");

                    if(parent != null)
                    {
                        this.writer.write(tagInstanceName + ".setParent(" + parent.instanceName + ");");
                    }

                    this.writer.write(tagInstanceName + ".setPageContext(pageContext);");

                    for(var i in attributes)
                    {
                        var expr = this.exprPool.parse(attributes[i]);
                        this.writer.write(tagInstanceName + ".set" + i.charAt(0).toUpperCase() + i.substring(1) + "(this." + expr.name + ".getValue(pageContext));");
                    }

                    this.writer.write("var " + flagName + " = " + tagInstanceName + ".doStartTag();");
                    this.writer.write("if(" + flagName + " != jsp.taglib.Tag.SKIP_BODY){");
                    this.writer.write("    if(" + tagInstanceName + ".setBodyContent != null){");
                    this.writer.write("        out = out.pushBody();");
                    this.writer.write("        " + tagInstanceName + ".setBodyContent(out);");
                    this.writer.write("    }");
                    this.writer.write("    while(true){");
                    this.writer.write("        " + flagName + " = " + tagInstanceName + ".doBody();");
                }

                c = this.stream.peek();

                if(c == "/")
                {
                    var offset = 0;

                    while(true)
                    {
                        c = this.stream.peek(offset++);

                        if(c == ">" || c == -1)
                        {
                            break;
                        }
                    }

                    this.stream.setPosition(this.stream.getPosition() + offset);
                    this.endTag(nodeName);
                }
            }
            else
            {
                this.buffer.write("<" + nodeName);
            }
        }
        else
        {
            this.buffer.write("<");
            this.buffer.write(c);
        }
    };

    /**
     * 
     */
    jsp.compile.JspCompiler.prototype.startScriptlet = function()
    {
        var f = this.stream.peek();

        if(f == "=")
        {
            this.stream.read();
        }

        var scriptlet = [];

        while((c = this.stream.read()) != -1)
        {
            if(c == "%" && this.stream.peek() == ">")
            {
                this.stream.read();
                break;
            }
            else
            {
                scriptlet.push(c);
            }
        }

        if(scriptlet.length > 0)
        {
            if(f == "=")
            {
                this.writer.write("    out.write(" + scriptlet.join("") + ");");
            }
            else
            {
                this.writer.write(scriptlet.join(""));
            }
        }
    };

    /**
     * @param nodeName
     */
    jsp.compile.JspCompiler.prototype.endTag = function(nodeName){
        var stack = this.stack;
        var tagLibrary = this.tagLibrary;

        if(tagLibrary != null && tagLibrary.getTagClassName(nodeName) != null)
        {
            var tag = stack.peek();
            var tagClassName = tagLibrary.getTagClassName(nodeName);

            if(tag.tagClassName == tagClassName)
            {
                stack.pop();
            }
            else
            {
                var i = -1;
                var e = null;
                var n = null;

                while((e = stack.peek(i)) != null)
                {
                    if(e.className == tagClassName)
                    {
                        n = e;
                        break;
                    }

                    i--;
                }

                if(n != null)
                {
                    while((e = stack.peek(-1)) != null)
                    {
                        if(e.className == tagClassName)
                        {
                            tag = stack.pop();
                            break;
                        }
                        else
                        {
                            stack.pop();
                        }
                    }
                }
                else
                {
                    throw {"name": "unclose exception", "message": ""}
                }
            }

            this.buffer.flush();

            if(tagClassName == "jsp.taglib.core.IfTag")
            {
                this.writer.write("}");
            }
            else if(tagClassName == "jsp.taglib.core.SetTag")
            {
            }
            else if(tagClassName == "jsp.taglib.core.OutTag")
            {
                this.writer.write(tag.instanceName + ".doEndTag();");
                this.writer.write("out = out.popBody();");
                this.writer.write("//////////////////////// jsp.taglib.core.OutTag END");
            }
            else if(tagClassName == "jsp.taglib.core.ForEachTag")
            {
                this.writer.write("}");

                if(tag.eachVarName != null && tag.tempObjectName != null)
                {
                    this.writer.write("pageContext.setAttribute(\"" + tag.eachVarName + "\", " + tag.tempObjectName + ");");
                }
            }
            else if(tagClassName == "jsp.taglib.core.ChooseTag")
            {
            }
            else if(tagClassName == "jsp.taglib.core.WhenTag")
            {
                this.writer.write("}");
            }
            else if(tagClassName == "jsp.taglib.core.OtherwiseTag")
            {
                this.writer.write("}");
            }
            else
            {
                this.writer.write("        " + tag.flagName + " = " + tag.instanceName + ".doAfterBody();");
                this.writer.write("        if(" + tag.flagName + " != jsp.taglib.Tag.EVAL_BODY_AGAIN){");
                this.writer.write("            break;");
                this.writer.write("        }");
                this.writer.write("    }");
                this.writer.write("    " + tag.instanceName + ".doEndTag();");

                // if instance of BodyTag
                this.writer.write("    if(" + tag.instanceName + ".setBodyContent != null){");
                this.writer.write("        out = out.popBody();");
                this.writer.write("    }");
                this.writer.write("}");
            }
        }
        else
        {
            this.buffer.write("</");
            this.buffer.write(nodeName);
            this.buffer.write(">");
        }
    };

    /*
     * $RCSfile: Expression,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.el.Expression = function(name, expression) /* extend Object */{
        this.name = name;
        this.expression = expression;
    };

    /**
     * write value to writer stream
     * @param out
     * @param pageContext
     */
    jsp.el.Expression.prototype.write = function(out, pageContext){
        var value = this.getValue(pageContext);

        if(value != null){
            out.write(value.toString());
        }
    };

    /**
     * write value to writer stream
     * @param out
     * @param pageContext
     */
    jsp.el.Expression.prototype.print = function(out, context){
        this.write(out, context);
    };

    /**
     * write value to writer stream
     * @param out
     * @param pageContext
     */
    jsp.el.Expression.prototype.println = function(out, context){
        this.write(out, context);
        this.write("\r\n");
    };

    /**
     * @param pageContext
     * @return boolean
     */
    jsp.el.Expression.prototype.getBoolean = function(pageContext){
        return (this.getValue(pageContext) == true);
    };

    /**
     * @param pageContext
     * @return int
     */
    jsp.el.Expression.prototype.getInteger = function(pageContext){
        return parseInt(this.getValue(context));
    };

    /**
     * @param pageContext
     * @return float
     */
    jsp.el.Expression.prototype.getFloat = function(pageContext){
        return parseFloat(this.getValue(context));
    };

    /**
     * @param pageContext
     * @return String
     */
    jsp.el.Expression.prototype.getString = function(pageContext){
        var value = this.getValue(pageContext);
        return (value != null ? value.toString() : "");
    };

    /**
     * @param pageContext
     * @return Object
     */
    jsp.el.Expression.prototype.getValue = function(pageContext){
        var name = this.name;
        var method = pageContext[name];

        if(method != null)
        {
            try
            {
                return method.apply(pageContext);
            }
            catch(e)
            {
            }
        }

        return null;
    };

    /*
     * $RCSfile: Scriptlet,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.scriptlet.Scriptlet = function() /* extend Object */ {
    };

    /**
     * @param context
     * @return String
     */
    jsp.scriptlet.Scriptlet.prototype.execute = function(context){
        // first execute: compile expression
        var writer = new jsp.runtime.JspWriter();
        var pageContext = jsp.runtime.PageContextFactory.create(this, context);

        pageContext.getWriter = function(){
            return writer;
        };

        this._jspService(pageContext);
        return writer.toString();
    };

    /**
     * @param context
     * @return String
     */
    jsp.scriptlet.Scriptlet.prototype.service = function(request, response, servletChain){
        // first execute: compile expression
        this._jspService(request, response);
    };

    /**
     * release resource
     */
    jsp.scriptlet.Scriptlet.prototype.release = function(){
    };

    /*
     * $RCSfile: PageContext,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.runtime.PageContext = function(servlet, request, response) /* extend Object */ {
        this.servlet = servlet;
        this.request = request;
        this.response = response;
    };

    /**
     * @return servlet
     */
    jsp.runtime.PageContext.prototype.getServlet = function(){
        return this.servlet;
    };

    /**
     * @param request
     */
    jsp.runtime.PageContext.prototype.setRequest = function(request){
        this.request = request;
    };

    /**
     * @return request
     */
    jsp.runtime.PageContext.prototype.getRequest = function(){
        return this.request;
    };

    /**
     * @param response
     */
    jsp.runtime.PageContext.prototype.setResponse = function(response){
        this.response = response;
    };

    /**
     * @return response
     */
    jsp.runtime.PageContext.prototype.getResponse = function(){
        return this.response;
    };

    /**
     * @return response
     */
    jsp.runtime.PageContext.prototype.getWriter = function(){
        return this.response.getWriter();
    };

    /**
     * @param name
     * @param value
     */
    jsp.runtime.PageContext.prototype.setAttribute = function(name, value){
        this[name] = value;
    };

    /**
     * @param name
     * @return Object
     */
    jsp.runtime.PageContext.prototype.getAttribute = function(name){
        return this[name];
    };

    /**
     * dump
     * @param name
     * @return Object
     */
    jsp.runtime.PageContext.prototype.toString = function(){
        var buffer = [];

        for(var i in this)
        {
            buffer.push("this." + i + " = " + (this[i] != null ? this[i].toString() : "null") + ";\r\n");
        }

        return buffer.join("");
    };

    /*
     * $RCSfile: JspFactory,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.runtime.JspFactory = {};

    /**
     * @param servlet
     * @param request
     * @param response
     * @return jsp.runtime.PageContext
     */
    jsp.runtime.JspFactory.getPageContext = function(servlet, request, response){
        var names = request.getAttributeNames();
        var pageContext = new jsp.runtime.PageContext(servlet, request, response);

        for(var i = 0, length = names.length; i < length; i++)
        {
            pageContext[names[i]] = request.getAttribute(names[i]);
        }

        var properties = servlet.exprList;

        for(var i in properties)
        {
            pageContext[i] = properties[i];
        }

        return pageContext;
    };

    /*
     * $RCSfile: PageContextFactory,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.runtime.PageContextFactory = {};

    /**
     * @param scriptlet
     * @param context
     * @param properties
     * @return jsp.runtime.PageContext
     */
    jsp.runtime.PageContextFactory.create = function(servlet, context){
        var pageContext = new jsp.runtime.PageContext(servlet);

        for(var i in context)
        {
            pageContext[i] = context[i];
        }

        var properties = servlet.exprList;

        for(var i in properties)
        {
            pageContext[i] = properties[i];
        }

        return pageContext;
    };

    /*
     * $RCSfile: JspWriter,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.runtime.JspWriter = function(){this.buffer = [];};

    /**
     * @param source
     */
    jsp.runtime.JspWriter.prototype.write = function(source){
        if(source != null && source != undefined){
            this.buffer.push(source);
        }
        else
        {
            this.buffer.push("null");
        }
    };

    /**
     * @param source
     */
    jsp.runtime.JspWriter.prototype.print = function(source){this.write(source);};

    /**
     * @param source
     */
    jsp.runtime.JspWriter.prototype.println = function(source){this.write(source); this.write("\r\n");};

    /**
     * wrap a new JspWriter
     * @return jsp.taglib.BodyContent
     */
    jsp.runtime.JspWriter.prototype.pushBody = function(){
        return new jsp.taglib.BodyContent(this);
    };

    /**
     * unwrap the current JspWriter
     * @return jsp.taglib.BodyContent
     */
    jsp.runtime.JspWriter.prototype.popBody = function(){
        return this.jspWriter;
    };

    /**
     * @param source
     */
    jsp.runtime.JspWriter.prototype.flush = function(){
        /* don't do this
        if(this.jspWriter != null){
            this.jspWriter.write(this.buffer.join(""));
        }
        */
    };

    /**
     * close current stream
     */
    jsp.runtime.JspWriter.prototype.close = function(){};

    /**
     * @return String
     */
    jsp.runtime.JspWriter.prototype.getString = function(){return this.buffer.join("");};

    /**
     * @return String
     */
    jsp.runtime.JspWriter.prototype.toString = function(){return this.buffer.join("");};

    /*
     * $RCSfile: JspRuntime,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.runtime.JspRuntime = {};

    /**
     * @param source
     * @return jsp.scriptlet.Scriptlet
     * @see jsp.scriptlet.Scriptlet
     * @note: the Scriptlet.service will be execute
     */
    jsp.runtime.JspRuntime.compile = function(source, template){
        if(template == null)
        {
            template = [
                "new (function(){",
                "this._jspService = function(pageContext){",
                "var out = pageContext.getWriter();",
                "${METHOD_BODY}",
                "}/* service end */;",
                "${DECLARE_BODY}",
                "})();"
            ].join("\r\n");
        }

        var compiler = new jsp.compile.JspCompiler();
        var script = compiler.compile(source, template);

        var scriptlet = null;
        var exception = null;

        try
        {
            scriptlet = eval("(function(){return " + script + ";})();");
            scriptlet = jsp.runtime.ScriptletFactory.create(scriptlet);
        }
        catch(e)
        {
            exception = e;
        }

        if(scriptlet == null)
        {
            scriptlet = {"script": script, "exception": exception};
        }
        else
        {
            scriptlet.script = script;
        }

        return scriptlet;
    };

    /**
     * if you use jstl.taglib.core.js, you will get a Object instance of jsp.taglib.TagLibrary
     * else return null
     * @return jsp.taglib.TagLibrary
     */
    jsp.runtime.JspRuntime.getTagLibrary = function(){
        return null;
    };

    /*
     * $RCSfile: ScriptletFactory,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.runtime.ScriptletFactory = {};

    /**
     * wrap scriptlet
     * @param scriptlet
     * @return jsp.scriptlet.Scriptlet
     */
    jsp.runtime.ScriptletFactory.create = function(scriptlet){
        if(scriptlet == null)
        {
            return null;
        }

        if(scriptlet.exprList == null)
        {
            var exprPool = scriptlet.exprPool;

            if(exprPool.length > 0)
            {
                var buffer = [];

                for(var i  = 0; i < exprPool.length; i++)
                {
                    buffer.push("    this." + exprPool[i].name + " = function(){ return (" + exprPool[i].expression + "); };\r\n");
                }

                scriptlet.exprList = new (new Function(buffer.join("")))();
            }
            else
            {
                scriptlet.exprList = {};
            }
        }
		
        return Class.extend(new jsp.scriptlet.Scriptlet(), scriptlet);
    };

    return jsp;
})();
