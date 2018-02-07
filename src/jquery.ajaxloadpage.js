!function ($) {
    "use strict";
    //变量定义与赋值
    var oldUrl = location.href, newUrl, urlData, loadCount = 0;
    //主体方法
    var AjaxLoadPage = function (element, options) {
        var _this = this;
        //默认赋值
        _this.options = $.extend({}, AjaxLoadPage.DEFAULTS, options);
        //处理打开事件
        $(element).on(_this.options.trigger, _this.options.bindNodes, function (event) {
            //根据事件类型与节点名称，设置数据
            if (event.type === 'click' && this.tagName === "A") {
                newUrl = $(this).attr("href");
                urlData = null;
            } else if (event.type === 'submit' && this.tagName === "FORM") {
                newUrl = $(this).attr("action");
                urlData = $(this).serialize();
            } else {
                return true;
            }
            //加载页面
            _this.LoadPage(newUrl, urlData);
            event.preventDefault();
            return false;
        });
        //处理当前页 history
        if (!(window.history && window.history.pushState && history.replaceState)) {
            _this.options.isHistory = false;
        }
        if (_this.options.isHistory) {
            history.replaceState({url: oldUrl, data: null}, null, oldUrl);
            $(window).on("popstate", function () {
                if (history.state) {
                    _this.LoadPage(history.state.url, history.state.data, true);
                }
            });
        }
    };
    //加载页面方法
    AjaxLoadPage.prototype.LoadPage = function (url, data, lock_history) {
        var _this = this;
        _this.options.before.call();
        //Ajax 加载数据
        $("<div/>").load(url, data, function (response, status, xhr) {
            if (status === "success") {
                loadCount++;
                //替换数据
                var parseHTML = $.parseHTML(response);
                var jqHTML = $("<div>").append($(parseHTML));
                $.each(_this.options.replaceNodes, function (oldNode, newNode) {
                    $(oldNode).html(jqHTML.find(newNode).children());
                });
                //替换页面状态
                if (loadCount === 1) {
                    if ($("<a/>").attr("href", url)[0].href === $("<a/>").attr("href", oldUrl)[0].href) {
                        lock_history = true;
                    }
                }
                if (_this.options.isHistory && !lock_history) {
                    history.pushState({url: url, data: data}, null, url);
                }
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
        isHistory: true,
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