## 欢迎使用 jQuery AjaxLoadPage 插件

`jQuery.AjaxLoadPage` 是一款主要解决 Ajax 加载同类型页面的插件，插件支持多个节点绑定，支持替换多个节点。

### 示例文件
[基本示例](https://ztj1993.github.io/jQuery-AjaxLoadPage/demos/index.html)  

### 使用说明
`jQuery.AjaxLoadPage` 具体的使用示例可以参考 demos 目录的演示文件。

**首先需要引入文件：**
```
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script src="../src/jquery.ajaxloadpage.js"></script>
```

**认识选项：**

| 选项名称 | 类型 | 默认值 | 说明 | 
| -------- | ---- | ------ | ---- | 
| bindNodes | String | null | 绑定的节点，主要为 A 或者 FORM | 
| replaceNodes | Json Object | {} | 替换的节点，键为当前页节点，值为请求页节点 | 
| isHistory | Bool | true | 是否启用 History，主要对前进后退的支持 | 
| trigger | String | "click submit" | 对 bindNodes 进行事件绑定 | 
| before | Callback | None | Ajax 请求前 | 
| finished | Callback | None | Ajax 请求完成 | 
| error | Callback | None | Ajax 请求错误 | 

**插件调用示例**
```
$("body").AjaxLoadPage({
    bindNodes: "div.nav1 a, div.nav2 a",
    replaceNodes: {
        "div.nav2": "div.nav2",
        "div.content": "div.content"
    },
    isHistory: true,
    trigger: "click submit",
    before: function () {
        console.log('ajax before');
    },
    finished: function () {
        console.log('ajax finished');
    },
    error: function () {
        console.log('ajax error');
    }
});
```
