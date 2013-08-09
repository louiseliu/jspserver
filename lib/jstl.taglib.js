(function(){
    /*
     * $RCSfile: jstl.taglib.js,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    if(typeof(jsp) == "undefined")
    {
        jsp = {"taglib": {TagFactory: {create: function(){return (function(){});}}}};
    }

    jsp.taglib = {};

    /*
     * $RCSfile: TagFactory,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.TagFactory = {};

    /**
     * @param parent
     * @return constructor
     */
    jsp.taglib.TagFactory.create = function(parent, constructor){
        return Class.create(parent, constructor);
    };

    /**
     * @return TagLibrary
     */
    jsp.taglib.TagFactory.getStandardTagLibrary = function(){
        if(this.standardTagLibrary == null)
        {
            this.standardTagLibrary = new jsp.taglib.TagLibrary();
        }

        if(jsp.taglib.core != null)
        {
            this.standardTagLibrary.setup({
                "c": {
                    "if":        "jsp.taglib.core.IfTag",
                    "set":       "jsp.taglib.core.SetTag",
                    "out":       "jsp.taglib.core.OutTag",
                    "each":      "jsp.taglib.core.ForEachTag",
                    "forEach":   "jsp.taglib.core.ForEachTag",
                    "choose":    "jsp.taglib.core.ChooseTag",
                    "when":      "jsp.taglib.core.WhenTag",
                    "otherwise": "jsp.taglib.core.OtherwiseTag",
                    "format":    "jsp.taglib.core.DateFormatTag"
                }
            });
        }

        return this.standardTagLibrary;
    };

    /**
     * @return TagLibrary
     */
    jsp.runtime.JspRuntime.getTagLibrary = function(){
        return jsp.taglib.TagFactory.getStandardTagLibrary();
    };

    /*
     * $RCSfile: Tag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.Tag = function(){};

    /* doStartTag() -> doInitBody() -> setBodyContent() -> doAfterBody() -> doEndTag() */
    jsp.taglib.Tag.SKIP_BODY = 0;
    jsp.taglib.Tag.EVAL_BODY_INCLUDE = 1;
    jsp.taglib.Tag.EVAL_BODY_AGAIN = 2;
    jsp.taglib.Tag.EVAL_BODY_BUFFERED = 2;
    jsp.taglib.Tag.SKIP_PAGE = 5;
    jsp.taglib.Tag.EVAL_PAGE = 6;

    /**
     * @param parent
     */
    jsp.taglib.Tag.prototype.setParent = function(parent){
        this.parent = parent;
    };

    /**
     * @param parent
     */
    jsp.taglib.Tag.prototype.getParent = function(){
        return this.parent;
    };

    /**
     * @param pageContext
     */
    jsp.taglib.Tag.prototype.setPageContext = function(pageContext){
        this.pageContext = pageContext;
    };

    /**
     * @return PageContext
     */
    jsp.taglib.Tag.prototype.getPageContext = function(){
        return this.pageContext;
    };

    /**
     * 
     */
    jsp.taglib.Tag.prototype.release = function(){
    };

    /*
     * $RCSfile: TagSupport,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.TagSupport = jsp.taglib.TagFactory.create(jsp.taglib.Tag, function(){});

    /**
     * @return SKIP_BODY | EVAL_BODY_INCLUDE
     */
    jsp.taglib.TagSupport.prototype.doStartTag = function(){
        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @param pageContext
     * @return SKIP_BODY | EVAL_BODY_INCLUDE
     */
    jsp.taglib.TagSupport.prototype.doInitBody = function(){
        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @return EVAL_PAGE
     */
    jsp.taglib.TagSupport.prototype.doBody = function(){
        return jsp.taglib.Tag.EVAL_PAGE;
    };

    /**
     * @return SKIP_BODY | EVAL_BODY_TAG
     */
    jsp.taglib.TagSupport.prototype.doAfterBody = function(){
        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @return SKIP_PAGE | EVAL_PAGE
     */
    jsp.taglib.TagSupport.prototype.doEndTag = function(){
        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @return SKIP_PAGE | EVAL_PAGE
     */
    jsp.taglib.TagSupport.prototype.finish = function(){
    };

    /*
     * $RCSfile: BodyTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.BodyTag = jsp.taglib.TagFactory.create(jsp.taglib.TagSupport, function(){});

    /**
     * @param bodyContent
     */
    jsp.taglib.BodyTag.prototype.doStartTag = function(bodyContent){
        return jsp.taglib.Tag.EVAL_BODY_BUFFERED;
    };

    /**
     * @param bodyContent
     */
    jsp.taglib.BodyTag.prototype.setBodyContent = function(bodyContent){
        this.bodyContent = bodyContent;
    };

    /**
     * @return BodyContent
     */
    jsp.taglib.BodyTag.prototype.getBodyContent = function(){
        return this.bodyContent;
    };

    /*
     * $RCSfile: ConditionalTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.ConditionalTag = jsp.taglib.TagFactory.create(jsp.taglib.TagSupport, function(){});

    /**
     * @return boolean
     */
    jsp.taglib.ConditionalTag.prototype.condition = function(){
        return (this.flag == true);
    };

    /**
     * @param expression
     */
    jsp.taglib.ConditionalTag.prototype.setCondition = function(flag){
        this.flag = flag;
    };

    /**
     * @return String
     */
    jsp.taglib.ConditionalTag.prototype.getCondition = function(){
        return this.flag;
    };

    /*
     * $RCSfile: LoopTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.LoopTag = jsp.taglib.TagFactory.create(jsp.taglib.TagSupport, function(){});

    /**
     * @return Object
     */
    jsp.taglib.LoopTag.prototype.getCurrent = function(){
        return this.current;
    };

    /**
     * @return Object
     */
    jsp.taglib.LoopTag.prototype.next = function(){
        return this.current;
    };

    /**
     * @return Object
     */
    jsp.taglib.LoopTag.prototype.hasNext = function(){
        return false;
    };

    /*
     * $RCSfile: IteratorTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.IteratorTag = jsp.taglib.TagFactory.create(jsp.taglib.LoopTag, function(){});

    /*
     * $RCSfile: BodyContent,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.BodyContent = Class.create(jsp.runtime.JspWriter, function(jspWriter){this.jspWriter = jspWriter});

    /**
     * @return String
     */
    jsp.taglib.BodyContent.prototype.getContent = function(){
        return this.getString();
    }

    /*
     * $RCSfile: TagLibrary,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.TagLibrary = function TagLibrary(){
        this.library = {};
    };

    /**
     * @param lib
     */
    jsp.taglib.TagLibrary.prototype.setup = function(lib){
        if(lib != null)
        {
            for(var i in lib)
            {
                if(this.library[i] == null)
                {
                    this.library[i] = {};
                }

                var e = this.library[i];
                var f = lib[i];

                for(var j in f)
                {
                    e[j] = f[j];
                }
            }
        }
    };

    /**
     * @param name
     * @return String
     */
    jsp.taglib.TagLibrary.prototype.getTagClassName = function(name){
        var i = name.indexOf(":");
        var library = this.library;

        if(i > -1)
        {
            var prefix = name.substring(0, i);
            var suffix = name.substring(i + 1);
            var lib = library[prefix];
            return (lib != null ? lib[suffix] : null);
        }

        return null;
    };

    /**
     * @param name
     * @return boolean
     */
    jsp.taglib.TagLibrary.prototype.available = function(name){
        return (this.getInstance(name) != null);
    };

    /**
     * @param name
     * @return String
     */
    jsp.taglib.TagLibrary.prototype.toString = function(){
        var buffer = [];
        var library = this.library;

        buffer.push("{\r\n");

        for(var i in library)
        {
            var e = library[i];
            buffer.push("    \"" + i + "\": {\r\n");

            for(var j in e)
            {
                buffer.push("        \"" + j + "\": " + "\"" + e[j] + "\",\r\n");
            }

            var text = buffer[buffer.length - 1];

            if(text.charAt(text.length - 3) == ",")
            {
                buffer[buffer.length - 1] = text.substring(0, text.length - 3) + "\r\n";
            }

            buffer.push("    },\r\n");
        }

        var text = buffer[buffer.length - 1];

        if(text.charAt(text.length - 3) == ",")
        {
            buffer[buffer.length - 1] = text.substring(0, text.length - 3) + "\r\n";
        }

        buffer.push("}");

        return buffer.join("");
    };
})();
