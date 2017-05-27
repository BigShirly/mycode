/**
 * 
$("a[delete=true]").click(function() {
               var id = $(this).attr("curId");
               queren("确认要删除吗？", function() {
                   $.post("productDel.ashx", { "action": "delete", "id": id }, function(data, status) {
                       if (data == "ok") {
                           message("删除成功！");
                           $("a[curId='" + id + "']").parent().parent().parent().parent().remove();
                       }
                   });
               });
           });

 */
$(document).ready(function() {
	 var boardDiv = "<div id='message' style='display:none;'><span id='spanmessage'></span></div>";
	 $(document.body).append(boardDiv);
});
//只是提示信息alert
function message(text) {
    $("#spanmessage").text(text);
    $("#message").show();
    $("#message").dialog({
        title:"提示",
        modal: true,
        width: 300,
        height: 100,
        buttons: {
            "确定": function() {
                $(this).dialog("close");
            }
        }
    });
}
//类似于confirm的功能
//说明callback是如果要选择是，要执行的方法
function queren(text, callback) {
    $("#spanmessage").text(text);
    $("#message").show();
    $("#message").dialog({
        title: "确认",
        modal: true,
        resizable: false,
        width: 300,
        height: 100,
        buttons: {
            "否": function() {
                $(this).dialog("close");
            },
            "是": function() {
                callback.call();//方法回调
                $(this).dialog("close");
            }
        }
    });
}