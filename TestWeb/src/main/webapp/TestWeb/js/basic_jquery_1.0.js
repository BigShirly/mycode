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
	
	if(ck_v.length == 1){
		if(ck_v[0].value =="on"){
			return ;
		}
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
	$("#id").val(id_key);
	ajax_data(url,jQuery.parseJSON(req_value));
}

function query_win(url){
	var ck_v = $("#p input:checked");
	if(ck_v.length == 0){
		alert("请选择您所要浏览的记录！");
		return ;
	}
	
	if(ck_v.length == 1){
		if(ck_v[0].value =="on"){
			return ;
		}
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
	
	if(ck_v.length == 1){
		if(ck_v[0].value =="on"){
			return ;
		}
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

function add_params(url,ddl){
	var req_value = "{";
	var col_v = "", col_n = "";
	var name = $("#id").attr("name");
	var flag = true;
	var speFlag = true;
	$("#w").find("input").each(function(){
		//console.log(this.type+"=1="+col_n+"=1="+$("#"+this.id).val());
		if(this.type == "text" && this.id != ""){
			var attr_V = $("#"+this.id).attr("class");
			if(attr_V != ""){
				//取出input中的输入值
				col_n = this.id.split("_")[0];
				if(col_n == name){
					name = "";
				}
				var typeValue = attr_V.split(" ")[0];
				//input校验
				var data_options = $("#"+this.id).attr("data-options");
				if(data_options != "" && data_options !=null){
					var opts = $("#"+this.id).data("options");
					if(!validate_v(opts,typeValue,this.id)){
						flag = false;
					}
				}
				if(typeValue == "easyui-textbox"){
					col_v = $("#"+this.id).textbox("getValue");
				}else if(typeValue == "easyui-numberbox"){
					col_v = $("#"+this.id).numberbox("getValue");
				}else if(typeValue == "easyui-combobox"){
					col_v = $("#"+this.id).combobox("getValue");
				}else if(typeValue == "easyui-datebox"){
					col_v = $("#"+this.id).datebox("getValue");
				}else if(typeValue == "easyui-datetimebox"){
					col_v = $("#"+this.id).datetimebox("getValue");
				}else if(typeValue == "combo-f"){
					col_v = $("#"+this.id).datebox("getValue");
					//console.log("日期:"+col_v);
				}else if(typeValue == "timespinner-f"){
					col_v = $("#"+this.id).timespinner("getValue");
					//console.log("时间:"+col_v);
				}
				//if(col_v!="" && !/^[^<]+$/.test(col_v) && flag){
				/**
				 特殊字符不做检验
				if(col_v!="" && !/^[^<|^>|^%|^_]+$/.test(col_v) && flag){
					$("#"+this.id+"_m").text("包含特殊字符<>%_");
					$("#"+this.id+"_m").css("display","block");
					speFlag = false;
				}else if(flag){
					$("#"+this.id+"_m").css("display","none");
				}
				**/
				if(col_v != "")
					req_value = req_value+"\""+col_n+"\":\"" +  $.trim(col_v) + "\",";
			}
		}else if(this.type == "radio" && this.name != ""){
			if(document.getElementById(this.id).checked) {
				col_n = this.name.split("_")[0];
				if(col_n == name){
					name = "";
				}
				req_value = req_value+"\""+col_n+"\":\"" + this.value + "\",";
			}
		}else if(this.type == "hidden" && this.id != ""){
			//console.log( "=2="+this.id);
			if(document.getElementById(this.id).value != "") {
				col_n = this.id.split("_")[0];
				if(col_n == name){
					name = "";
				}
				
				
				req_value = req_value+"\""+col_n+"\":\"" + $("#"+this.id).val() + "\",";
			}
		}else if(this.type == "password" && this.id != ""){
			//console.log( "=2="+this.id);
			if(document.getElementById(this.id).value != "") {
				col_n = this.id.split("_")[0];
				if(col_n == name){
					name = "";
				}
				
				
				req_value = req_value+"\""+col_n+"\":\"" + $("#"+this.id).val() + "\",";
			}
		}
		
	});
	$("#w .textarea").each(function(){
		if(this.id != ""){
			var data_options = $("#"+this.id).attr("data-options");
			if(data_options != "" && data_options !=null){
				var opts = $("#"+this.id).data("options");
				if(!validate_v(opts,typeValue,this.id)){
					flag = false;
				}
			}
			req_value = req_value+"\""+this.id.split("_")[0]+"\":\"" + encodeURI($.trim(this.value)) + "\",";
		}
	});
	$("#w .textarea_c").each(function(){
		if(this.id != ""){
			var data_options = $("#"+this.id).attr("data-options");
			if(data_options != "" && data_options !=null){
				var opts = $("#"+this.id).data("options");
				if(!validate_v(opts,typeValue,this.id)){
					flag = false;
				}
			}

			req_value = req_value+"\""+this.id.split("_")[0]+"\":\"" + $.trim(this.value) + "\",";

		}
	});
	if(ddl == "edit" && name !=""){
		req_value = req_value+"\""+name+"\":\"" +  $("#id").val() + "\",";
	}
	req_value = req_value.substring(0, req_value.length-1);
	req_value = req_value + "}";

	if(flag&&speFlag)
		ajax_data(url,jQuery.parseJSON(req_value));
}

function validate_v(options,typeValue,id){
	var arrays = options.split(",");
	var validate_flag = true;
	$.each(arrays,function(index){
		var key_value = arrays[index].split(":");
		if(key_value[0] == "required"){
			validate_flag = validate_required(key_value[1],typeValue,id);
		}else if(key_value[0] == "validType"){
			validate_flag = validate_validType(key_value[1],typeValue,id);
		}else if(key_value[0] == "maxLength"){
			validate_flag = validate_maxLength(key_value[1],typeValue,id);
		}else if(key_value[0] == "minLength"){
			validate_flag = validate_minLength(key_value[1],typeValue,id);
		}else if(key_value[0] == "validEndDate"){
			validate_flag = validate_validEndDate(key_value[1],typeValue,id);
		}else if(key_value[0] == "validComBox"){
			validate_flag = validate_validComBox(key_value[1],typeValue,id);
		}else if(key_value[0] == "validTextBox"){
			validate_flag = validate_validTextBox(key_value[1],typeValue,id);
		}
		if(!validate_flag){
			return validate_flag;
		}
	});
	return validate_flag;
}

function validate_required(key_value,typeValue,id){
	if(typeValue == "easyui-textbox"){
		//console.log(id+"$"+$.trim($("#"+id).textbox("getValue"))+"$")
		if($.trim($("#"+id).textbox("getValue")) == "" || $("#"+id).textbox("getValue")==null ){
			$("#"+id+"_m").text("不能为空");
			$("#"+id+"_m").css("display","block");
			//console.log($("#"+id+"_m").text())
			return false;
		}
		else if($.trim($("#"+id).textbox("getValue")).toLowerCase() == "null"){
			$("#"+id+"_m").text("不能为null");
			$("#"+id+"_m").css("display","block");
			return false;
		}
		else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
		
	}else if(typeValue == "easyui-numberbox"){
		if($("#"+id).textbox("getValue") == "" || $("#"+id).textbox("getValue")==null){
			$("#"+id+"_m").text("不能为空");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}else if(typeValue == "easyui-datebox"){
		if($("#"+id).datebox("getValue") == "" || $("#"+id).datebox("getValue")==null){
			$("#"+id+"_m").text("不能为空");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}else if(typeValue == "easyui-datetimebox"){
		if($("#"+id).datetimebox("getValue") == "" || $("#"+id).datetimebox("getValue")==null){
			$("#"+id+"_m").text("不能为空");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}else if(typeValue == "easyui-combobox"){
		if($("#"+id).combobox("getValue") == "" || $("#"+id).combobox("getValue")==null){
			$("#"+id+"_m").text("必须选择");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}
}
function validate_validType(key_value,typeValue,id){
	if(typeValue == "easyui-textbox"){
		if($("#"+id).textbox("getValue") != "" && $("#"+id).textbox("getValue")!=null){
			var rules = $.fn.validatebox.defaults.rules;
			for(var rule in rules){
				if("'" + rule +"'" == key_value){
					if(!rules[rule].validator($("#"+id).textbox("getValue"))){
						$("#"+id+"_m").show().text("格式不正确");
						return false;
					}else{
						break;
					}
				}
			}
		}else{
			$("#"+id+"_m").css("display","none");
		}
		return true;
	}
}
function validate_maxLength(key_value,typeValue,id){
	if(typeValue == "easyui-textbox"){
		if($("#"+id).textbox("getValue") != "" && $("#"+id).textbox("getValue").length > parseInt(key_value)){
			$("#"+id+"_m").text("字符长度超过"+key_value+"位");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}
}
function validate_validEndDate(key_value,typeValue,id){
	if(typeValue == "easyui-datetimebox"){
		var startDate = $('#' + key_value).datetimebox("getValue");
		var endDate = $('#' + id).datetimebox("getValue");
		if(startDate > endDate){
			$("#"+id+"_m").text("开始时间不能大于结束时间");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}
}
function validate_validComBox(key_value,typeValue,id){
	if(typeValue == "easyui-combobox"){
		if($("#"+id).combobox("getValue") == "" || $("#"+id).combobox("getValue")==null){
			$("#"+id+"_m").text("必须选择");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}
}
function validate_validTextBox(key_value,typeValue,id){
	if(typeValue == "easyui-textbox"){
		//console.log(id+"$"+$.trim($("#"+id).textbox("getValue"))+"$")
		if($.trim($("#"+id).textbox("getValue")) == "" || $("#"+id).textbox("getValue")==null ){
			$("#"+id+"_m").text("不能为空");
			$("#"+id+"_m").css("display","block");
			//console.log($("#"+id+"_m").text())
			return false;
		}
		else if($.trim($("#"+id).textbox("getValue")).toLowerCase() == "null"){
			$("#"+id+"_m").text("不能为null");
			$("#"+id+"_m").css("display","block");
			return false;
		}
		else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
		
	}
}
function validate_minLength(key_value,typeValue,id){
	if(typeValue == "easyui-textbox"){
		if($("#"+id).textbox("getValue") != "" && $("#"+id).textbox("getValue").length < parseInt(key_value)){
			$("#"+id+"_m").text("字符长度少于"+key_value+"位");
			$("#"+id+"_m").css("display","block");
			return false;
		}else{
			$("#"+id+"_m").css("display","none");
			return true;
		}
	}
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
        			$('#w').window('close');
        			$("#tt").datagrid('reload');
        		}else if(data.type=="query"){
        			edit_set(data.rows);
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
	$.each(rows[0],function(k,v){
		if($("#"+k+"_a").length > 0){
			var class_style = $("#"+k+"_a").attr("class");
			if(class_style=='undefined'||class_style==undefined){
				return true; 
			}
			//console.log(class_style)
			//console.log(k)
			if(class_style != "" && class_style == "textarea"){
				$("#"+k+"_a").val(decodeURI(v));
			}else if(class_style != "" && class_style == "textarea_c"){
				$("#"+k+"_a").val(v);
			}else if(class_style != ""){
				var tempclass = class_style.split(" ")[0];
				if(tempclass == "easyui-textbox"){
					$("#"+k+"_a").textbox("setValue",v);
					//console.log(k+"=="+v);
					if($("#"+k+"_a").attr("edit") == "false")
						$("#"+k+"_a").textbox("disable","none");
				}else if(tempclass == "easyui-numberbox"){
					$("#"+k+"_a").numberbox("setValue",v);
					if($("#"+k+"_a").attr("edit") == "false")
						$("#"+k+"_a").numberbox("disable","none");
				}else if(tempclass == "easyui-combobox"){
					if(v!="0" || v != 0){
						$("#"+k+"_a").combobox('select', v);
						if($("#"+k+"_a").attr("edit") == "false")
							$("#"+k+"_a").combobox("disable","none");
					}
				}else if(tempclass == "easyui-datebox"){
					if(v!="0" || v != 0){
						$("#"+k+"_a").datebox('setValue', v);
						if($("#"+k+"_a").attr("edit") == "false")
							$("#"+k+"_a").datebox("disable","none");
					}
				}else if(tempclass == "easyui-datetimebox"){
					if(v!="0" || v != 0){
						$("#"+k+"_a").datetimebox('setValue', v);
						if($("#"+k+"_a").attr("edit") == "false")
							$("#"+k+"_a").datetimebox("disable","none");
					}
				}else if(tempclass == "combo-f"){
					
					if(v!="0" || v != 0){
						$("#"+k+"_a").datetimebox('setValue', v);
						if($("#"+k+"_a").attr("edit") == "false")
							$("#"+k+"_a").datetimebox("disable","none");
					}
					//col_v = $("#"+this.id).datebox("getValue");
					//console.log("日期:"+col_v);
				}else if(tempclass == "timespinner-f"){
					if(v!="0" || v != 0){
						$("#"+k+"_a").timespinner('setValue', v);
						if($("#"+k+"_a").attr("edit") == "false")
							$("#"+k+"_a").timespinner("disable","none");
					}
					
				}
				
			}
		}else{
			if($("input[name='"+k+"_a']").length > 1){
				if($("input[name='"+k+"_a']").attr("type") != "" && $("input[name='"+k+"_a']").attr("type") == "radio");
					$("input[name='"+k+"_a'][value="+v+"]").click();
			}else if($("#"+k+"_l").length > 0){
				$("#"+k+"_l").val(v);
			}
		}
	});
}

function view_set(rows){
	$.each(rows[0],function(k,v){
		if(v == null || v == ""){
			$("#"+k+"_v").text(" ");
		}else{
			$("#"+k+"_v").text(decodeURI(v));
		}
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
