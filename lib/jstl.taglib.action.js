(function(){
    if(typeof(com) == "undefined")
    {
        com = {"mytest": {"util": {}, "taglib": {}}};
    }

    if(com.mytest == null)
    {
        com.mytest = {};
    }

    if(com.mytest.util == null)
    {
        com.mytest.util = {};
    }

    if(com.mytest.taglib == null)
    {
        com.mytest.taglib = {};
    }
})();

(function(){
    /*
     * $RCSfile: ScriptActionTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ScriptActionTag = com.mytest.taglib.ScriptActionTag = jsp.taglib.TagFactory.create(jsp.taglib.TagSupport, function(){});

    /**
     * @return int
     */
    ScriptActionTag.prototype.doStartTag = function(){
        return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
    };

    /**
     * @return int
     */
    ScriptActionTag.prototype.doEndTag = function(){
        var executeResult = this.getExecuteResult();

        if(executeResult != true && executeResult != "true")
        {
            return jsp.taglib.Tag.EVAL_PAGE;
        }

        /*
        var content = null;
        var actionName = this.getNamespace() + "/" + this.getName();
        var scriptlet = Container.getScriptlet(actionName);

        if(scriptlet == null)
        {
            content = "ERROR: NoSuchActionException: " + actionName;
        }
        else
        {
            content = scriptlet.execute((this.parameters || {}));
        }

        this.getPageContext().getWriter().print(content);
        */

        return jsp.taglib.Tag.EVAL_PAGE;
    };

    /**
     * @param namespace
     * @return String
     */
    ScriptActionTag.prototype.setNamespace = function(namespace){
        this.namespace = namespace;
    };

    /**
     * @return String
     */
    ScriptActionTag.prototype.getNamespace = function(){
        return this.namespace;
    };

    /**
     * @param name
     * @return String
     */
    ScriptActionTag.prototype.setName = function(name){
        this.namespace = name;
    };

    /**
     * @return String
     */
    ScriptActionTag.prototype.getName = function(){
        return this.name;
    };

    /**
     * @param action
     * @return String
     */
    ScriptActionTag.prototype.setAction = function(){
        this.action = action;
    };

    /**
     * @return String
     */
    ScriptActionTag.prototype.getAction = function(){
        return this.action;
    };

    /**
     * @param executeResult
     * @return String
     */
    ScriptActionTag.prototype.setExecuteResult = function(executeResult){
        this.executeResult = executeResult;
    };

    /**
     * @return String
     */
    ScriptActionTag.prototype.getExecuteResult = function(){
        return this.executeResult;
    };

    /**
     * @return String
     */
    ScriptActionTag.prototype.setParameter = function(name, value){
        if(name == null || value == null)
        {
            return null;
        }

        if(this.parameters == null)
        {
            this.parameters = {};
        }

        return (this.parameters[name] = value);
    };

    /*
     * $RCSfile: ParameterTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var ParameterTag = com.mytest.taglib.ParameterTag = jsp.taglib.TagFactory.create(jsp.taglib.BodyTag, function(){});

    /**
     * @return int
     */
    ParameterTag.prototype.doStartTag = function(){
        return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
    };

    /**
     * @return int
     */
    ParameterTag.prototype.doEndTag = function(){
        var name = this.getName();
        var value = this.getValue();

        if(value == null)
        {
            var bodyContent = this.getBodyContent();

            if(bodyContent != null)
            {
                value = bodyContent.getString();
            }
        }

        if(name != null && value != null)
        {
            var parent = this.getParent();

            if(parent != null && parent.setParameter != null)
            {
                parent.setParameter(name, value);
            }
            else
            {
                throw {"name": "TagException", "message": "parent tag 's:action' not found !"};
            }
        }

        return jsp.taglib.Tag.EVAL_PAGE;
    };

    /**
     * @param name
     * @return String
     */
    ParameterTag.prototype.setName = function(name){
        this.name = name;
    };

    /**
     * @return String
     */
    ParameterTag.prototype.getName = function(){
        return this.name;
    };

    /**
     * @param value
     * @return String
     */
    ParameterTag.prototype.setValue = function(value){
        this.value = value;
    };

    /**
     * @return String
     */
    ParameterTag.prototype.getValue = function(){
        return this.value;
    };

    var tagLibrary = jsp.runtime.JspRuntime.getTagLibrary();

    if(tagLibrary != null)
    {
        tagLibrary.setup({
            "s": {"action": "com.mytest.taglib.ScriptActionTag"},
            "s": {"parameter": "com.mytest.taglib.ParameterTag"}
        });
    }
    /*
    <c:set var="defaultPageSize" value="20"/>
    <s:action namespace="/saction/index" name="userList">
        <s:parameter name="param1">111</s:parameter>
        <s:parameter name="param2">222</s:parameter>
        <s:parameter name="param3">abc</s:parameter>
        <s:parameter name="pageSize">${defaultPageSize}</s:parameter>
    </s:action>
    */
})();
