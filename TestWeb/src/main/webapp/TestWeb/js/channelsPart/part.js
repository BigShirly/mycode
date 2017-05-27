
function edit_wins(id){
	var req_value = "{\"id_key\":\"" + id + "\"}";
	$('#add_buttons').css('display',"none");
	$('#edit_buttons').css('display',"");
	$('#clear_buttons').css('display',"none");
	form_clear();
	$("#id").val(id);
	ajax_data("channelspart/query.dhtml",jQuery.parseJSON(req_value));
}
function querySupplierType(rec){
	var partType = $("#partType_a").combobox("getValue")
	//alert(partType);
	if(partType == '010'){ //比例
		//$("#partScale_a").textbox("setValue","");
		$("#partScale_a").textbox("enable","none");
		
		$("#lowMoney_a").textbox("disable","none");
		$("#lowMoney_a").textbox("setValue","");
		$("#highMoeny_a").textbox("disable","none");
		$("#highMoeny_a").textbox("setValue","");
		
		$("#moneySet1").css("display","none");
		$("#moneySet2").css("display","block");
		
	}else if(partType == '020'){//金额
		$("#partScale_a").textbox("setValue","");
		$("#partScale_a").textbox("disable","none");
		
		$("#lowMoney_a").textbox("enable","none");
		$("#highMoeny_a").textbox("enable","none");
		
		$("#moneySet1").css("display","block");
		$("#moneySet2").css("display","none");
		
	}
}
var rowId = 0;
var cashierCount = 0;
function addSet(divId){
	cashierCount = 0;
	rowId ++;
	var req_value = "{\"status\":\"010\"}";
	var params = jQuery.parseJSON(req_value) ;
	//var url = "cashierconfig/search.dhtml" ;
	var url = "paysupplierinfo/search.dhtml";
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:600000,
        dataType:'json',
        data:params,               
        success:function(data){
           //处理保存完毕后处理
            //console.log(data.code);
            var select = "<select id='sel"+rowId+"' rowId='"+rowId+"' class='selClass nosubmit'>" ;
        	if(data.code == "success"){
        		cashierCount = data.total;
        		$.each(data.rows,function(k,v){
        			//console.log(k+"="+v.supplierName);
	        		var option = "<option value='"+v.supplierNo+"'>" ;
        			option += v.supplierName;
	        		option += "</option>";
	        		select += option ;
        		});
	        	select += "</select>";
        	}else{
        		//console.log(data.message);
        	}
        	if(divId=="setTable1"){  //金额
        		var html = "<tr class='tr2 nosubmit'><td><input type='text' value='' id='inputS"+rowId+"' class='Snosubmit nosubmit' /></td>"+
    				"<td><input type='text' value=''  id='inputE"+rowId+"'  class='Enosubmit nosubmit' /></td><td>"+select+"</td><td onclick='removeCashier(this);' style='cursor:pointer'>删除</td></tr>";
        	}else if(divId=="setTable2"){ //比例
        		var html = "<tr class='tr2 nosubmit'><td><input type='text' value='' id='inputB"+rowId+"' class='Snosubmit nosubmit' /></td>"+
    				"<td>"+select+"</td><td onclick='removeCashier(this);' style='cursor:pointer'>删除</td></tr>";
        	}
    		$("#"+divId+" tr:eq(0)").after(html);
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
function removeCashier(divId){
	$(divId).parent().remove();
}
function add_win_new(){
	rowId =0;
	$('#add_buttons').css('display',"");
	$('#edit_buttons').css('display',"none");
	$('#clear_buttons').css('display',"");
	form_clear();
	$("tr.nosubmit").remove();
	$('#w').window('open');
}
//根据分流类型，选择不同的处理方法
function add_updateT(url,ddl){
	var param = $("#partType_a").combobox("getValue");
	if(param =="010"){  //比例
		add_paramsS(url,ddl);
	}else if(param=="020"){ //金额
		add_paramsM(url,ddl);
	}

}
//添加、修改-按金额
function add_paramsM(url,ddl){
	var req_value = "{";
	var col_v = "", col_n = "";
	var name = $("#id").attr("name");
	var flag = true;
	
	$("#w").find("input:not('.nosubmit')").each(function(){
		if(this.type == "text" && this.id != ""){
			var attr_V = $("#"+this.id).attr("class");
			if(attr_V != ""){
				//取出input中的输入值
				col_n = this.id.split("_")[0];
				if(col_n == name){
					name = "";
				}
				//console.log("id====="+this.id);
				//console.log("t====="+attr_V);
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
				}
				if(col_v!="" && !/^[^<]+$/.test(col_v) && flag){
					$("#"+this.id+"_m").text("包含特殊字符");
					$("#"+this.id+"_m").css("display","block");
				}else if(flag){
					$("#"+this.id+"_m").css("display","none");
				}
				if(col_v != "")
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
			}
		}else if(this.type == "radio" && this.name != ""){
			if(document.getElementById(this.id).checked) {
				col_n = this.name.split("_")[0];
				if(col_n == name){
					name = "";
				}
				req_value = req_value+"\""+col_n+"\":\"" + this.value + "\",";
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
			req_value = req_value+"\""+this.id.split("_")[0]+"\":\"" + encodeURI(this.value) + "\",";
		}
	});
	if(ddl == "edit" && name !=""){
		req_value = req_value+"\""+name+"\":\"" +  $("#id").val() + "\",";
	}
	var c = $(".selClass").length;
	//alert("c--"+c+"--cashierCount-"+cashierCount);
	//if(c>cashierCount){
	//	alert("您最多只能设置【"+cashierCount+"】个收银台！");
	//	return;
	//}
	if(c==0){	
		alert("请设置分流方案！");
		return;
	}
	
	var arr_supplierNos = "";
    var arr_lowMoneys = "";
    var arr_highMoneys = "";
    
    $.each($(".selClass"),function(i,obj){
    	var rowId = $(this).attr("rowId") ;
    	if(typeof rowId === "undefined"){
    	}
    	arr_supplierNos += $(this).val()+",";
    	arr_lowMoneys += $("#inputS"+rowId).val()+",";
    	arr_highMoneys += $("#inputE"+rowId).val()+",";
    });
	var supplierNos 	= arr_supplierNos.substring(0,arr_supplierNos.length-1);
	var lowMoneys 		= arr_lowMoneys.substring(0,arr_lowMoneys.length-1);
	var highMoneys 		= arr_highMoneys.substring(0,arr_highMoneys.length-1);
	if(supplierNos!=''){
		req_value = req_value+"\"supplierNos\":\"" + supplierNos + "\",";
	}
	if(lowMoneys!=''){
		req_value = req_value+"\"lowMoneys\":\"" + lowMoneys + "\",";
	}
	if(highMoneys!=''){
		req_value = req_value+"\"highMoneys\":\"" + highMoneys + "\",";
	}
	//console.log("req_value====="+req_value);
	req_value = req_value.substring(0, req_value.length-1);
	req_value = req_value + "}";
	//alert("test="+v_money())
	//alert("---req_value"+req_value);
	if(!v_money()){
		//alert("金额不能为空");
	}else{
	    if(flag&&v_money()) {
	    	ajax_data(url,jQuery.parseJSON(req_value));
	    }
	}
}

//添加、修改-按比例
function add_paramsS(url,ddl){
	var req_value = "{";
	var col_v = "", col_n = "";
	var name = $("#id").attr("name");
	var flag = true;
	
	$("#w").find("input:not('.nosubmit')").each(function(){
		if(this.type == "text" && this.id != ""){
			var attr_V = $("#"+this.id).attr("class");
			if(attr_V != ""){
				//取出input中的输入值
				col_n = this.id.split("_")[0];
				if(col_n == name){
					name = "";
				}
				//console.log("id====="+this.id);
				//console.log("t====="+attr_V);
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
				}
				if(col_v!="" && !/^[^<]+$/.test(col_v) && flag){
					$("#"+this.id+"_m").text("包含特殊字符");
					$("#"+this.id+"_m").css("display","block");
				}else if(flag){
					$("#"+this.id+"_m").css("display","none");
				}
				if(col_v != "")
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
			}
		}else if(this.type == "radio" && this.name != ""){
			if(document.getElementById(this.id).checked) {
				col_n = this.name.split("_")[0];
				if(col_n == name){
					name = "";
				}
				req_value = req_value+"\""+col_n+"\":\"" + this.value + "\",";
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
			req_value = req_value+"\""+this.id.split("_")[0]+"\":\"" + encodeURI(this.value) + "\",";
		}
	});
	if(ddl == "edit" && name !=""){
		req_value = req_value+"\""+name+"\":\"" +  $("#id").val() + "\",";
	}
	var c = $(".selClass").length;
	//alert("c--"+c+"--cashierCount-"+cashierCount);
	//if(c>cashierCount){
	//	alert("您最多只能设置【"+cashierCount+"】个收银台！");
	//	return;
	//}
	if(c==0){	
		alert("请设置分流方案！");
		return;
	}
	
	var arr_supplierNos = "";
    var arr_lowMoneys = "";
    
    $.each($(".selClass"),function(i,obj){
    	var rowId = $(this).attr("rowId") ;
    	if(typeof rowId === "undefined"){
    	}
    	arr_supplierNos += $(this).val()+",";
    	arr_lowMoneys += $("#inputB"+rowId).val()+",";
    });
	var supplierNos 	= arr_supplierNos.substring(0,arr_supplierNos.length-1);
	var lowMoneys 		= arr_lowMoneys.substring(0,arr_lowMoneys.length-1);
	var highMoneys		='';
	
	if(supplierNos!=''){
		req_value = req_value+"\"supplierNos\":\"" + supplierNos + "\",";
	}
	if(lowMoneys!=''){
		req_value = req_value+"\"lowMoneys\":\"" + lowMoneys + "\",";
	}
	if(highMoneys!=''){
		req_value = req_value+"\"highMoneys\":\"" + highMoneys + "\",";
	}
	req_value = req_value.substring(0, req_value.length-1);
	req_value = req_value + "}";
	//alert("test="+v_money())
	console.log(jQuery.parseJSON(req_value));
	ajax_data_edit(url,jQuery.parseJSON(req_value));
	 
}

//验证最小最大金额
function v_money(){
	var flag = true
	//alert($.isNumeric($.trim($(this).val())));
	$.each($(".Snosubmit"),function(i,obj){
		var money = $.trim($(this).val());
		//alert(money+"=money1")
		if(money==''){
			flag =  false;
		}
		if(!$.isNumeric($.trim($(this).val()))){
			flag =  false;
		}
	});
	$.each($(".Enosubmit"),function(i,obj){
		var money = $.trim($(this).val());
		//alert(money+"=money2")
		if(money==''){
			flag =  false;
		}
		if(!$.isNumeric($.trim($(this).val()))){
			flag =  false;
		}
	});
	if(!flag){
		alert("金额不能为空或字符");
		return flag;
	}
	for(i=1;i<=rowId;i++){
		var s = parseInt($.trim($("#inputS"+i).val()));
		var e = parseInt($.trim($("#inputE"+i).val()));
		if(s>e){
			alert("起始金额不能大于结束金额");
			flag =  false;
		}
		//alert(s+"=========="+e)
	}
	return flag;
}
//跳到修改页面
function edit_win_new(url){
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
	
	//console.log("ck_v[1].value--"+ck_v[0].value);
	
	var req_value = "{\"id_key\":\"" + id_key + "\"}";
	var req_value_v = "{\"serialNo\":\"" + id_key + "\"}";
	
	var ids = id_key.split("-");
	console.log("ids---------"+ids[1]);
	
	if(ids[1]=="010"){ //比例
		//console.log("ids---------"+ids[1]);
		editSet('setTable2',jQuery.parseJSON(req_value_v));
	}else if(ids[1]=="020"){ //金额
		editSet('setTable1',jQuery.parseJSON(req_value_v));
	}
	$("#id").val(id_key);
	editSet('setTable2',jQuery.parseJSON(req_value_v));
	ajax_data_edit(url,jQuery.parseJSON(req_value_v));
}
//修改表单赋值
function editSet(divId,p){
	cashierCount = 0;
	$("tr.nosubmit").remove();
	var params = p;
	var url = "channelspart/searchEntitys.dhtml" ;
	
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:600000,
        dataType:'json',
        data:params,               
        success:function(data){
           //处理保存完毕后处理
           // console.log(data);
        	if(data.code == "success"){
        		$.each(data.rows,function(k,v){
        			var partType = v.partType;
		        	var cCode = v.supplierNo;
		        	var select = "" ;
		        	//var params = "" ;
		        	var req_value = "{\"status\":\"010\"}";
					var params = jQuery.parseJSON(req_value) ;
					var url = "paysupplierinfo/search.dhtml" ;
					
					$.ajax({  
				        type:"POST",  
				        url:url,
				        timeout:600000,
				        dataType:'json',
				        data:params,               
				        success:function(data){
				           //处理保存完毕后处理
				            //console.log(data.code);
				            rowId ++;
        					//console.log("rowId ========"+rowId);
        					
				            select = "<select id='sel"+rowId+"' rowId='"+rowId+"' class='selClass nosubmit'>" ;
				        	if(data.code == "success"){
				        		//cashierCount = data.total;
				        		$.each(data.rows,function(k,v){
				        			var checked = "" ;
				        			if(v.supplierNo==cCode){
				        				checked = "selected='selected'";
				        			}
					        		var option = "<option value='"+v.supplierNo+"' "+checked+" >" ;
				        			option += v.supplierName;
					        		option += "</option>";
					        		select += option ;
				        		});
					        	select += "</select>";
				        	}else{
				        	
				        	}
				        	
				        	if(partType =="010"){  //比例
				        		var html = "<tr class='tr2 nosubmit'><td><input type='text' value='"+v.partScale+"' id='inputB"+rowId+"' class='Snosubmit nosubmit'/></td><td>"+select+"</td><td onclick='$(this).parent().remove();'>删除</td></tr>";
				        	}else if(partType =="020"){  //金额
				        		var html = "<tr class='tr2 nosubmit'><td><input type='text' value='"+v.lowMoney_colmun+"' id='inputS"+rowId+"' class='Snosubmit nosubmit'/></td><td><input type='text' value='"+v.highMoeny_colmun+"'  id='inputE"+rowId+"'  class='Enosubmit nosubmit'/></td><td>"+select+"</td><td onclick='$(this).parent().remove();'>删除</td></tr>";
				        	}
				        	//console.log("---html-----"+html);
				        	$("#"+divId+" tr:eq(0)").after(html);
				        	
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
        		});
	        	
        	}else{
        		//console.log(data.message);
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

function ajax_data_edit(url,params){
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:600000,
        dataType:'json',
        data:params,               
        success:function(data){
        	console.log(url);
        	//console.log(data);
           //处理保存完毕后处理
        	if(data.code == "success"){
    			edit_set(data.rows);
    			$('#w').window('open');
        	}else{
        		alert(data.message);
        	}
        },
        error: function(){  
           alert('系统异常，请稍后重试!!！');  
        },
        complete : function(XMLHttpRequest,status){
        	if(status == "timeout"){
        		ajaxTimeoutTest.abort();
        		alert("加载数据超时！");
        	}
        }
     });
}