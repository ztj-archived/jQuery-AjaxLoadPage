!function ($) {
    "use strict";
    //变量定义与赋值
    var oldUrl = location.href, newUrl, urlData;
    //主体方法
    var AjaxLoadPage = function (element, options) {
        var _this = this;
        //默认赋值
        _this.options = $.extend({}, AjaxLoadPage.DEFAULTS, options);
        //处理打开事件
        $(element).on(_this.options.trigger, _this.options.bindNodes, function () {
            if (this.tagName === "A") {
                newUrl = $(this).attr("href");
                urlData = null;
            } else if (this.tagName === "FORM") {
                newUrl = $(this).attr("action");
                urlData = $(this).serialize();
            } else {
                return false;
            }
            _this.LoadPage(newUrl, urlData, _this.options);
            event.preventDefault();
        });
    };
    //加载页面方法
    AjaxLoadPage.prototype.LoadPage = function (url, data) {
        var _this = this;
        _this.options.before.call();
        //Ajax 加载数据
        $("<div/>").load(url, data, function (response, status, xhr) {
            if (status === "success") {
                //替换数据
                var parseHTML = $.parseHTML(response);
                var jqHTML = $("<div>").append($(parseHTML));
                $.each(_this.options.replaceNodes, function (oldNode, newNode) {
                    $(oldNode).replaceWith(jqHTML.find(newNode));
                });
                //替换页面状态
                history.pushState(null, document.title, oldUrl);
                var result, title;
                if ((result = response.match(/<title>([\s\S]+)<\/title>/i)) !== null) {
                    title = result[1];
                } else {
                    title = document.title;
                }
                document.title = title;
                //调用完成方法
                _this.options.finished.call();
            } else if (status === "error") {
                _this.options.error.call(xhr.status);
            }
        });
    };
    //默认参数
    AjaxLoadPage.DEFAULTS = {
        bindNodes: "",
        replaceNodes: {},
        trigger: "click submit",
        before: function () {
        },
        finished: function () {
        },
        error: function () {
        }
    };
    var old = $.fn.AjaxLoadPage;
    $.fn.AjaxLoadPage = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('AjaxLoadPage');
            var options = (typeof option === 'object') && option;
            if (!data) $this.data('AjaxLoadPage', (data = new AjaxLoadPage(this, options)));
        })
    };
    $.fn.AjaxLoadPage.Constructor = AjaxLoadPage;
    $.fn.AjaxLoadPage.noConflict = function () {
        $.fn.AjaxLoadPage = old;
        return this;
    };
}(jQuery);