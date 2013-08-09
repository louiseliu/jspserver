(function(){
    /*
     * $RCSfile: jstl.taglib.core.js,v $$
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

    jsp.taglib.core = {};

    /*
     * $RCSfile: LoopTagStatus,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.LoopTagStatus = function(){};

    /*
     * $RCSfile: IfTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.IfTag = jsp.taglib.TagFactory.create(jsp.taglib.ConditionalTag, function(){});

    /**
     * @return int
     */
    jsp.taglib.core.IfTag.prototype.doStartTag = function(){
        if(this.condition())
        {
            return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
        }

        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @return boolean
     */
    jsp.taglib.core.IfTag.prototype.condition = function(){
        return (this.expression != null);
    };

    /*
     * $RCSfile: SetTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.SetTag = jsp.taglib.TagFactory.create(jsp.taglib.TagSupport, function(){});

    /**
     * @return int
     */
    jsp.taglib.core.SetTag.prototype.doStartTag = function(){
        if(this.variable != null)
        {
            if(this.value != null)
            {
                this.getPageContext().setAttribute(this.variable, this.value);
            }
        }
        else
        {
            throw {"name": "", "message": "SetTag must has 'var' attribute !"};
        }

        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @param variable
     */
    jsp.taglib.core.SetTag.prototype.setVar = function(variable){
        this.variable = variable;
    };

    /**
     * @return Object
     */
    jsp.taglib.core.SetTag.prototype.getVar = function(){
        return this.variable;
    };

    /**
     * @param value
     */
    jsp.taglib.core.SetTag.prototype.setValue = function(value){
        this.value = value;
    };

    /**
     * @return Object
     */
    jsp.taglib.core.SetTag.prototype.getValue = function(){
        return this.value;
    };

    /*
     * $RCSfile: OutTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.OutTag = jsp.taglib.TagFactory.create(jsp.taglib.BodyTag, function(){});

    /**
     * @return int
     */
    jsp.taglib.core.OutTag.prototype.doStartTag = function(){
        var value = this.getValue();

        if(value != null)
        {
            if(this.getEscapeXml() == true)
            {
                value = com.skin.util.HtmlUtil.encode(value);
            }

            this.getPageContext().getWriter().write(value);
        }

        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @return int
     */
    jsp.taglib.core.OutTag.prototype.doEndTag = function(){
        var bodyContent = this.getBodyContent();

        if(bodyContent != null)
        {
            var value = bodyContent.getString();

            if(value != null)
            {
                if(this.getEscapeXml() == true)
                {
                    value = com.skin.util.HtmlUtil.encode(value);
                }

                this.getPageContext().getWriter().write(value);
            }
        }

        return jsp.taglib.Tag.EVAL_PAGE;
    };

    /**
     * @param escapeXml
     */
    jsp.taglib.core.OutTag.prototype.setEscapeXml = function(escapeXml){
        this.escapeXml = escapeXml;
    };

    /**
     * @return boolean
     */
    jsp.taglib.core.OutTag.prototype.getEscapeXml = function(){
        return this.escapeXml;
    };

    /**
     * @param value
     */
    jsp.taglib.core.OutTag.prototype.setValue = function(value){
        this.value = value;
    };

    /**
     * @return String
     */
    jsp.taglib.core.OutTag.prototype.getValue = function(){
        return this.value;
    };

    /*
     * $RCSfile: ForEachTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.LoopTagSupport = jsp.taglib.TagFactory.create(jsp.taglib.LoopTag, function(){
        this.index = 0;
        this.begin = -1;
        this.count = 0;
        this.end = -1;
        this.step = -1;
        this.current = null;
        this.loopTagStatus = this;
    });

    /**
     * @return int
     */
    jsp.taglib.core.LoopTagSupport.prototype.doStartTag = function(){
        if(this.end != -1 && this.begin > this.end)
        {
            return jsp.taglib.Tag.SKIP_BODY;
        }

        if(this.begin > -1)
        {
            this.index = this.begin;
        }
        else
        {
            this.index = 0;
        }

        this.index = 0;
        this.count = 0;

        if(this.hasNext())
        {
            this.current = this.next();
        }
        else
        {
            return jsp.taglib.Tag.SKIP_BODY;
        }

        return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
    };

    /**
     * @param begin
     */
    jsp.taglib.core.LoopTagSupport.prototype.setBegin = function(begin){
        this.begin = begin;
    };

    /**
     * @return int
     */
    jsp.taglib.core.LoopTagSupport.prototype.getBegin = function(){
        return this.begin;
    };

    /**
     * @return int
     */
    jsp.taglib.core.LoopTagSupport.prototype.getCount = function(){
        return this.count;
    };

    /**
     * @param current
     */
    jsp.taglib.core.LoopTagSupport.prototype.setCurrent = function(current){
        this.current = current;
    };

    /**
     * @return Object
     */
    jsp.taglib.core.LoopTagSupport.prototype.getCurrent = function(){
        return this.current;
    };

    /**
     * @param end
     */
    jsp.taglib.core.LoopTagSupport.prototype.setEnd = function(end){
        this.end = end;
    };

    /**
     * @return int
     */
    jsp.taglib.core.LoopTagSupport.prototype.getEnd = function(){
        return this.end;
    };

    /**
     * @param index
     */
    jsp.taglib.core.LoopTagSupport.prototype.setIndex = function(index){
        this.index = index;
    };

    /**
     * @return int
     */
    jsp.taglib.core.LoopTagSupport.prototype.getIndex = function(){
        return this.index;
    };

    /**
     * @param step
     */
    jsp.taglib.core.LoopTagSupport.prototype.setStep = function(step){
        this.step = step;
    };

    /**
     * @return int
     */
    jsp.taglib.core.LoopTagSupport.prototype.getStep = function(){
        return this.step;
    };

    /**
     * @return boolean
     */
    jsp.taglib.core.LoopTagSupport.prototype.isFirst = function(){
        return (this.count == 1) || (this.index == 0);
    };

    /**
     * @return boolean
     */
    jsp.taglib.core.LoopTagSupport.prototype.isLast = function(){
        return ((this.index + this.step) >= this.end);
    };

    /**
     * @return boolean
     */
    jsp.taglib.core.LoopTagSupport.prototype.hasNext = function(){
        return false;
    };

    /**
     * @return boolean
     */
    jsp.taglib.core.LoopTagSupport.prototype.next = function(begin){
        return null;
    };

    /*
     * $RCSfile: ForEachTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.ForEachTag = jsp.taglib.TagFactory.create(jsp.taglib.core.LoopTagSupport, function(){
        this.breakable = true;
    });

    /**
     * @return int
     */
    jsp.taglib.core.ForEachTag.prototype.doStartTag = function(){
        if(this.end != -1 && this.begin > this.end)
        {
            return jsp.taglib.Tag.SKIP_BODY;
        }

        if(this.begin > -1)
        {
            this.index = this.begin;
        }
        else
        {
            this.index = 0;
        }

        if(this.step < 1)
        {
            this.step = 1;
        }

        this.index = this.index - this.step;

        if(this.items == null && this.begin > -1)
        {
            var list = [];

            for(var i = this.begin; i < this.end; i = i + this.step)
            {
                list.push(i);
            }

            this.setItems(list);
        }

        return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
    };

    /**
     * @return int
     */
    jsp.taglib.core.ForEachTag.prototype.doAfterBody = function(){
        return jsp.taglib.Tag.EVAL_PAGE;
    };

    /**
     * @param items
     */
    jsp.taglib.core.ForEachTag.prototype.getLoopStatus = function(){
        return this.loopStatus;
    };

    /**
     * @param items
     */
    jsp.taglib.core.ForEachTag.prototype.setVar = function(variable){
        this.variable = variable;
    };

    /**
     * @param items
     */
    jsp.taglib.core.ForEachTag.prototype.getVar = function(){
        return this.variable;
    };

    /**
     * @param items
     */
    jsp.taglib.core.ForEachTag.prototype.setItems = function(items){
        var list = [];

        if(items != null)
        {
            if(typeof(items) == "number")
            {
                list = null;
            }
            else if(typeof(items) == "string")
            {
                list = items.split(",");
            }
            else
            {
                if(items.length == null)
                {
                    for(var i in items)
                    {
                        list.push(items[i]);
                    }
                }
                else
                {
                    list = items;
                }
            }
        }

        this.iterator = new jsp.taglib.core.ForEachIterator(list);
    };

    /**
     * @param items
     */
    jsp.taglib.core.ForEachTag.prototype.getItems = function(){
        return this.iterator;
    };

    /**
     * @param items
     */
    jsp.taglib.core.ForEachTag.prototype.hasNext = function(){
        return this.iterator.hasNext();
    };

    /**
     * @param items
     */
    jsp.taglib.core.ForEachTag.prototype.next = function(){
        this.count++;
        this.index = this.index + this.step;

        if(this.hasNext())
        {
            this.current = this.iterator.next();
        }

        return this.current;
    };

    /*
     * $RCSfile: ChooseTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.ForEachIterator = function(items){
        this.index = 0;
        this.items = (items || []);
    };

    /**
     * @return boolean
     */
    jsp.taglib.core.ForEachIterator.prototype.hasNext = function(){
        return this.index < this.items.length;
    };

    /**
     * @return Object
     */
    jsp.taglib.core.ForEachIterator.prototype.next = function(){
        return this.items[this.index++];
    };

    /**
     * @return Object
     */
    jsp.taglib.core.ForEachIterator.prototype.iterator = function(items){
        var list = [];

        if(items != null)
        {
            if(typeof(items) == "number")
            {
                list = null;
            }
            else if(typeof(items) == "string")
            {
                list = items.split(",");
            }
            else
            {
                if(items.length == null)
                {
                    for(var i in items)
                    {
                        list.push(items[i]);
                    }
                }
                else
                {
                    list = items;
                }
            }
        }

        return list;
    };

    /*
     * $RCSfile: ChooseTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.ChooseTag = jsp.taglib.TagFactory.create(jsp.taglib.TagSupport, function(){});

    /**
     * return tag status, true or flase
     * @return int
     */
    jsp.taglib.core.ChooseTag.prototype.complete = function(){
        return (this.flag == 1);
    };

    /**
     * break choose, return immediately
     * @return int
     */
    jsp.taglib.core.ChooseTag.prototype.finish = function(){
        this.flag = 1;
    };

    /*
     * $RCSfile: WhenTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.WhenTag = jsp.taglib.TagFactory.create(jsp.taglib.ConditionalTag, function(){});

    /**
     * @return int
     */
    jsp.taglib.core.WhenTag.prototype.doStartTag = function(){
        var parent = this.getParent();

        if(parent == null)
        {
            throw {"name": "JspTagException", "message": "when tag must be in choose tag !"};
        }

        if(parent.complete() == true)
        {
            return jsp.taglib.Tag.SKIP_BODY;
        }

        // test condition
        if(this.condition != null && this.condition() == true)
        {
            // if has attribute: break
            if(this.$break == "true")
            {
                parent.finish();
            }
            else
            {
                return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
            }
        }

        return jsp.taglib.Tag.SKIP_BODY;
    };

    /**
     * @return int
     */
    jsp.taglib.core.WhenTag.prototype.doEndTag = function(){
        return jsp.taglib.Tag.EVAL_PAGE;
    };

    /*
     * $RCSfile: OtherwiseTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.OtherwiseTag = jsp.taglib.TagFactory.create(jsp.taglib.Tag, function(){});

    /**
     * @return int
     */
    jsp.taglib.core.OtherwiseTag.prototype.doStartTag = function(){
        return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
    };

    /*
     * $RCSfile: BreakableSupport,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    jsp.taglib.core.BreakableSupport = jsp.taglib.TagFactory.create(jsp.taglib.Tag, function(){});

    /**
     * @return int
     */
    jsp.taglib.core.BreakableSupport.prototype.doStartTag = function(){
        var flag = false;
        var parent = this;

        while((parent = parent.getParent()) != null)
        {
            if(parent.breakable == true)
            {
                flag = true;
                parent.finish();
                break;
            }
        }

        if(flag == false)
        {
            throw {"name": "JspTagException", "message": "BreakableTag not found !"};
        }

        return jsp.taglib.Tag.SKIP_BODY;
    };

    /*
     * $RCSfile: DateFormatTag,v $$
     * $Revision: 1.1 $
     * $Date: 2012-10-18 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var DateFormatTag = jsp.taglib.core.DateFormatTag = jsp.taglib.TagFactory.create(jsp.taglib.TagSupport, function(){
        this.variable = null;
        this.pattern = null;
        this.value = null;
    });

    /**
     * @param variable
     */
    DateFormatTag.prototype.setVar = function(variable){
        this.variable = variable;
    };

    /**
     * @return String
     */
    DateFormatTag.prototype.getVar = function(){
        return this.variable;
    };

    /**
     * @param pattern
     */
    DateFormatTag.prototype.setPattern = function(pattern){
        this.pattern = pattern;
    };

    /**
     * @return String
     */
    DateFormatTag.prototype.getPattern = function(){
        return this.pattern;
    };

    /**
     * @param value
     */
    DateFormatTag.prototype.setValue = function(value){
        this.value = value;
    };

    /**
     * @return Date
     */
    DateFormatTag.prototype.getValue = function(){
        return this.value;
    };

    /**
     * @return int
     */
    DateFormatTag.prototype.doStartTag = function(){
        return jsp.taglib.Tag.EVAL_BODY_INCLUDE;
    };

    /**
     * @return int
     */
    DateFormatTag.prototype.doEndTag = function(){
        var text = com.skin.util.DateFormat.format(this.getValue(), this.getPattern());

        if(this.getVar() != null)
        {
            this.getPageContext().setAttribute(this.getVar(), text);
        }
        else
        {
            this.getPageContext().getWriter().print(text);
        }

        return jsp.taglib.Tag.EVAL_PAGE;
    };
})();