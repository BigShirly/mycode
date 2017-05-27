$(function(){
	$('#search_button').click(function(){
		var dg = $('#tt');
	    var queryParams =dg.datagrid('options').queryParams;
	    params_str(queryParams);
	    dg.datagrid('options').queryParams = queryParams;  
	    dg.datagrid('reload'); 
	});
	
	$('#search_clear_button').click(function(){
		$("#tb").find("input").each(function(){
		  
		   if(this.type == "text" && this.id != ""){
			   var attr_V = $("#"+this.id).attr("class");
			   if(attr_V.indexOf("easyui-combobox") >= 0){
				   $("#"+this.id).combobox('setValue',"");
			   }else{
				   $("#"+this.id).textbox("setValue","");
			   }
		   }else if(this.type == "radio" && this.name != ""){
			   $("input[name='"+this.name+"'][value='']").click();
		   }
		});
	});
});

function colse_win(){
	$('#w').window('close');
}

function add_win(){
	$('#add_buttons').css('display',"");
	$('#edit_buttons').css('display',"none");
	$('#clear_buttons').css('display',"");
	form_clear();
	$('#w').window('open');
}

function edit_win(url){
	$('#add_buttons').css('display',"none");
	$('#edit_buttons').css('display',"");
	$('#clear_buttons').css('display',"none");
	form_clear();
	var ck_v = $("#p input:checked");
	if(ck_v.length == 0){
		alert("请选择您所要修改的记录！");
		return ;
	}
	if(ck_v.length > 2){
		alert("每次只能修改一条记录！");
		return ;
	}
	
	var id_key = ck_v[0].value;
	if(ck_v.length == 2){
		if(ck_v[0].value!="on"){
			alert("每次只能修改一条记录！");
			return ;
		}
		id_key = ck_v[1].value;
	}
	
	var req_value = "{\"id_key\":\"" + id_key + "\"}";
	ajax_data(url,jQuery.parseJSON(req_value));
}

function query_win(url){
	var ck_v = $("#p input:checked");
	if(ck_v.length == 0){
		alert("请选择您所要浏览的记录！");
		return ;
	}
	if(ck_v.length > 2){
		alert("每次只能浏览一条记录！");
		return ;
	}
	var id_key = ck_v[0].value;
	if(ck_v.length == 2){
		if(ck_v[0].value!="on"){
			alert("每次只能浏览一条记录！");
			return ;
		}
		id_key = ck_v[1].value;
	}
	var req_value = "{\"id_key\":\"" + id_key + "\"}";
	ajax_data(url,jQuery.parseJSON(req_value));
}

function del_entity(url){
	var ck_v = $("#p input:checked");
	if(ck_v.length == 0){
		alert("请选择您所要删除的记录！");
		return ;
	}
	
	if (!confirm("确认要删除？")) {
		return ;
    }
	
	var del_str = "";
	$(ck_v).each(function (index){
		if(ck_v[index].value!="on"){
			del_str = del_str + ck_v[index].value+",";
		}
	});
	
	del_str = del_str.substring(0, del_str.length-1);
	var req_value = "{\"id_key\":\"" + del_str + "\"}";
	ajax_data(url,jQuery.parseJSON(req_value));
}

function add_params(url){
	var col_array = $('#query_cols').val().split(",");
	var colName = null;
	var req_value = "{";
	var v = true;
	var message = "请检查页面的输入项是否正确";
	if(typeof(checks) == "function"){
		if(checks() == "false"){
			return;
		}
	}
	
	$(col_array).each(function (index){
		colName = col_array[index].split("_");
		if("t" == colName[1]){
			if($("#"+colName[0]+"_a").attr("notnull") == "true"){
				if($("#"+colName[0]+"_a").textbox("getValue") == ""){
					$("#"+colName[0]+"_m").css("display","");
					v = false;
				}else{
					$("#"+colName[0]+"_m").css("display","none");
				}
			}
			var page_v = $("#"+colName[0]+"_a").textbox("getValue");
			if(page_v!="" && !/^[^<>]+$/.test(page_v)){
				message = message + "，是否包含特殊字符"
				v = false;
			}
			req_value = req_value+"\""+colName[0]+"\":\"" +  $("#"+colName[0]+"_a").textbox("getValue") + "\",";
		}else if("s" == colName[1]){
			if($("#"+colName[0]+"_a").attr("notnull") == "true"){
				if($("#"+colName[0]+"_a").combobox("getValue") == ""){
					$("#"+colName[0]+"_m").css("display","");
					v = false;
				}else{
					$("#"+colName[0]+"_m").css("display","none");
				}
			}
			req_value = req_value+"\""+colName[0]+"\":\"" +  $("#"+colName[0]+"_a").combobox("getValue") + "\",";
		}else if("r" == colName[1]){
			req_value = req_value+"\""+colName[0]+"\":\"" +  $("input[name='"+colName[0]+"_a']:checked").val() + "\",";
		}else if("v" == colName[1]){
			req_value = req_value+"\""+colName[0]+"\":\"" +  $("#"+colName[0]+"_a").val() + "\",";
		}else if("c" == colName[1]){
			var vc = "";
			$("input[name='"+colName[0]+"_a']").each(function(i){ 
				if(this.checked)
					vc = vc +$(this).val()+",";
			});
			if(vc!="")
				vc = vc.substring(0,vc.length-1);
			req_value = req_value+"\""+colName[0]+"\":\"" +  vc + "\",";
		}else if("f" == colName[1]){//文件上传
			
		}else if("g" == colName[1]){//文本域
			req_value = req_value+"\""+colName[0]+"\":\"" +  $("#"+colName[0]+"_a").val() + "\",";
		}
	});
	req_value = req_value.substring(0, req_value.length-1);
	req_value = req_value + "}";
	if(v)
		ajax_data(url,jQuery.parseJSON(req_value));
	else
		alert(message);
}

function ajax_data(url,params){
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        data:params,               
        success:function(data){
           //处理保存完毕后处理
        	if(data.code == "success"){
        		if(data.type=="save"){
        			alert(data.message);
        			form_clear();
        			$("#tt").datagrid('reload');
        		}else if(data.type=="query"){
        			edit_set(data.rows);
        			up_set();
        			$('#w').window('open');
        		}else if(data.type=="del"){
        			alert(data.message);
        			$("#tt").datagrid('reload');  
        		}else if(data.type=="edit"){
        			alert(data.message);
        			form_clear();
        			$("#tt").datagrid('reload');  
        			$('#w').window('close');
        		}else if(data.type=="view"){
        			view_set(data.rows);
        		}else{
        			$('#w').window('close');
        		}
        	}else{
        		alert(data.message);
        	}
        },
        error: function(){  
           alert('系统异常，请稍后重试！');  
        },
        complete : function(XMLHttpRequest,status){
        	if(status == "timeout"){
        		ajaxTimeoutTest.abort();
        		alert("加载数据超时！");
        	}
        }
     });
}

function edit_set(rows){
	var col_array = $('#query_cols').val();
	var col_type = "";
	$.each(rows[0],function(k,v){
		var k_count = k.length;
		if(col_array.indexOf(k)>=0){
			col_type = col_array.substring(col_array.indexOf(k),col_array.indexOf(k)+k_count+2).split("_");
			if(col_type[1] == "t"){
				$("#"+col_type[0]+"_a").textbox("setValue",v);
			}else if(col_type[1] == "r"){
				$("input[name='"+col_type[0]+"_a'][value="+v+"]").click();
			}else if(col_type[1] == "s"){
				if(v!="0" || v != 0)
					$("#"+col_type[0]+"_a").combobox('select', v);
			}else if(col_type[1] == "v"){
				$("#"+col_type[0]+"_a").val(v);
			}else if(col_type[1] == "c"){
				var vl = v.split(",");
				$(vl).each(function (index){
					document.getElementById(col_type[0]+"_"+vl[index]).checked = true; 
				});
			}else if(col_type[1] == "v"){
				$("#"+col_type[0]+"_a").val(v);
			}else if(col_type[1] == "g"){
				document.getElementById(col_type[0]+"_a").innerHTML=v;
			}else if(col_type[1] == "h"){
				$("#"+col_type[0]+"_h").text(v);
			}else{
				$("#"+col_type[0]+"_a").val(v);
			}
		}
		
	});
}

function view_set(rows){
	$.each(rows[0],function(k,v){
		$("#"+k+"_v").text(v);
	});
	$('#wq').window('open');
}

function ajax_req(url,params){
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:3000,
        dataType:'json',
        data:params,               
        success:function(data){
        	if(data.code == "success"){
        		alert(data.message);
        	}else{
        		alert(data.message);
        	}
        	$("#tt").datagrid('reload');
        },
        error: function(){  
           alert('系统异常，请稍后重试！');  
        },
        complete : function(XMLHttpRequest,status){
        	if(status == "timeout"){
        		ajaxTimeoutTest.abort();
        		alert("操作超时！");
        	}
        }
     });
}
Date.prototype.format = function (format) {  
	var o = {  
		"M+": this.getMonth() + 1,  
		"d+": this.getDate(),  
		"h+": this.getHours(),  
		"m+": this.getMinutes(),  
		"s+": this.getSeconds(),  
		"q+": Math.floor((this.getMonth() + 3) / 3),  
		"S": this.getMilliseconds()  
	}  
	if (/(y+)/.test(format)) {  
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
	}  
	for (var k in o) {  
		if (new RegExp("(" + k + ")").test(format)) {  
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
		}  
	}  
	return format;  
} 
