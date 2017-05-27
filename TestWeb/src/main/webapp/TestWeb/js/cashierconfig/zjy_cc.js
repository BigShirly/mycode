var d = 0;

$(function(){
	/**
48	617  TBL_PAY_SUPPLIER_INFO	支付供应商基本表	PAY_MODE	支付方式	070	美盈宝	1	20				
49	616  TBL_PAY_SUPPLIER_INFO	支付供应商基本表	PAY_MODE	支付方式	060	企业银行	1	20				
50	209  TBL_PAY_SUPPLIER_INFO	支付供应商基本表	PAY_MODE	支付方式	030	分期付款	1	20				
51	208  TBL_PAY_SUPPLIER_INFO	支付供应商基本表	PAY_MODE	支付方式	050	支付平台	1	20				
52	207  TBL_PAY_SUPPLIER_INFO	支付供应商基本表	PAY_MODE	支付方式	040	扫码平台	1	20				
53	205  TBL_PAY_SUPPLIER_INFO	支付供应商基本表	PAY_MODE	支付方式	020	快捷支付	1	20				
54	206  TBL_PAY_SUPPLIER_INFO	支付供应商基本表	PAY_MODE	支付方式	010	网银支付	1	20	
	 */
	
	showBankForSupplierSupport('010','020','wy_djktable');
	showBankForSupplierSupport('010','010','wy_jjktable');
    
	showBankForSupplierSupport('020','010','kj_jjktable');
	showBankForSupplierSupport('020','020','kj_djktable');
	//分期查询贷记卡
    showBankForSupplierSupport('030','020','fqtable');
     
    showBankForSupplierSupport('040','010','smtable');
    showBankForSupplierSupport('050','010','pttable');
    showBankForSupplierSupport('060','010','qytable');
    showBankForSupplierSupport('070','010','mybtable');
    showBankForSupplierSupport('090','010','dftable');
    
    //点击设置  支付方式
    $(".zffs").each(function(){
    	var name = $(this).attr("name");
    	var obj = $(this);
    	obj.click(function(){
    		//清空信息
    		//reset_clear();
    		$('#w-'+name).window('open');
    		//reset_view_clear(wy_jjktable);
    	});
    });
    d=0;
})

function save_params(url,ddl){
	var req_value = "{";
	//var col_v = "", col_n = "";
	var name = $("#id").attr("name");
	var flag = true;
	
	var cashierName = $.trim($("#cashierName_a").val());
	
	if(cashierName==""){
		alert("请填写收银台名称！");
		return ;
	}else if(cashierName.length>=15){
		alert("收银台名称不超过15个字符！");
		return ;
	}
	if(!/^[^<|^>|^%|^_]+$/.test(cashierName)){
		alert("收银台名称包含特殊字符<>%_");
		return;
	}
	//时间段限制
	var limitType = $.trim($("#limitType_a").combobox('getValue'));
	//console.log("limitType -- limitType="+limitType);
	if(limitType!=""){
	 	//paramtime
	 	$("#w").find(".paramtime").each(function(){
			var col_n = this.id;    
			var col_v = $("#"+this.id).datetimebox("getValue");
			if(col_v != "")  req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
		});
		req_value = req_value+"\"limitType_a\":\"" +  limitType + "\",";
		//console.log("limitType -- req_value="+req_value);
	}
	
	var payMode="";
	var payModeSortPage="";
	$("#w").find(".paramcheckbox").each(function(){
		var t_payModeSortPage = $("#"+this.id+"pagesort").val() ;
		var t_payMode = $("#"+this.id).attr("value") ;
		var b = $(this).is(":checked");
		if(b){
			payMode += t_payMode +",";
			payModeSortPage += t_payModeSortPage +",";
		}
	});
	payMode = payMode.substring(0, payMode.length-1);
	payModeSortPage = payModeSortPage.substring(0, payModeSortPage.length-1);
	
	var arry = payModeSortPage.split(",");
	if(isRepeat(arry)){
		alert("序号填写重复，请重新填写！");  
		return;
	}
	//console.log(payMode)
	//console.log(payModeSortPage)
	//return ;
	//alert(payMode)
	if(payMode != ""){
	 	$("#payMode").val(payMode);
	 	$("#payModeSortPage").val(payModeSortPage);
	 	
	 	//console.log("payMode："+payMode);
	 	//console.log("payModeSortPage："+payModeSortPage);
	 	//通用  需要加参数部分
	 	$("#w").find(".commonparam").each(function(){
			var col_n = this.id;
			var col_v = $("#"+this.id).val();
			if(col_v != "")  req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
		});
		
		//各支付方式需要加参数部分
		if(payMode.indexOf('010')!=-1){
			var isSelected = false;
			$("#w").find(".wyparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "")  {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				}
			});
			//console.log("010："+req_value);
			if(!isSelected){
				alert("请选择网银支付支持银行");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#wypagesort").val())==''){
				alert("请填写网银支付排序");
				$("#wypagesort").focus();
				return;
			}
		}
		if(payMode.indexOf('020')!=-1){
			var isSelected = false;
			$("#w").find(".kjparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "") {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				} 
			});
			//console.log("020："+req_value);
			if(!isSelected){
				alert("请选择快捷支付支持银行");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#kjpagesort").val())==''){
				alert("请填写快捷支付排序");
				$("#kjpagesort").focus();
				return;
			}
		}
		if(payMode.indexOf('030')!=-1){
			var isSelected = false;
			$("#w").find(".fqparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "") {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				} 
			});
			//console.log("030："+req_value);
			if(!isSelected){
				alert("请选择分期支付支持银行");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#fqpagesort").val())==''){
				alert("请填写分期支付排序");
				$("#fqpagesort").focus();
				return;
			}
		}
		if(payMode.indexOf('040')!=-1){
			var isSelected = false;
			$("#w").find(".smparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "") {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				} 
			});
			//console.log("040："+req_value);
			if(!isSelected){
				alert("请选择扫码支付支持第三方平台");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#smpagesort").val())==''){
				alert("请填写扫码支付排序");
				$("#smpagesort").focus();
				return;
			}
		}
		if(payMode.indexOf('050')!=-1){
			var isSelected = false;
			$("#w").find(".ptparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "") {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				} 
			});
			//console.log("050："+req_value);
			if(!isSelected){
				alert("请选择平台支付支持第三方平台");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#ptpagesort").val())==''){
				alert("请填写平台支付排序");
				$("#ptpagesort").focus();
				return;
			}
		}
		if(payMode.indexOf('060')!=-1){
			var isSelected = false;
			$("#w").find(".qyparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "") {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				} 
			});
			//console.log("060："+req_value);
			if(!isSelected){
				alert("请选择企业网银支持银行");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#qypagesort").val())==''){
				alert("请填写企业网银排序");
				$("#qypagesort").focus();
				return;
			}
		}
		if(payMode.indexOf('070')!=-1){
			var isSelected = false;
			$("#w").find(".mybparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "") {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				} 
			});
			//console.log("070："+req_value);
			if(!isSelected){
				alert("请选择美盈宝支持银行");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#mybpagesort").val())==''){
				alert("请填写美盈宝排序");
				$("#mybpagesort").focus();
				return;
			}
		}
		if(payMode.indexOf('090')!=-1){
			var isSelected = false;
			$("#w").find(".dfparam").each(function(){
				var col_n = this.id;
				var col_v = $("#"+this.id).val();
				if(col_v != "") {
					req_value = req_value+"\""+col_n+"\":\"" +  col_v + "\",";
					isSelected = true;
				} 
			});
			//console.log("050："+req_value);
			if(!isSelected){
				alert("请选择代付支付支持第三方平台");
				return;
			}
			//判断排序文本框 kjpagesort
			if($.trim($("#dfpagesort").val())==''){
				alert("请填写平台支付排序");
				$("#dfpagesort").focus();
				return;
			}
		}
		
		//有效 无效
		var s_col_n = $('input:radio[name=status_a]:checked').attr("name");
		var s_col_v =  $('input:radio[name=status_a]:checked').val();
		if(s_col_v != "")  req_value = req_value+"\""+s_col_n+"\":\"" +  s_col_v + "\",";
		
		//console.log("提交参数："+req_value);
		
		//去除最后一个逗号
		req_value = req_value.substring(0, req_value.length-1);
		req_value = req_value + "}";
		
		//alert("提交参数："+req_value)
		//console.log("提交参数："+req_value); 
		if(req_value != "") ajax_data(url,jQuery.parseJSON(req_value));
		$("#w").window("close");
	} else{
		alert("请选择支付方式！");
	}
	
	
	 
}

//---------------------------edit--------------------
function edit_win_new(){
	
	var url = "cashierconfig/query.dhtml" ;
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
	$("#cashierCode").val(id_key);
	var params=jQuery.parseJSON(req_value);
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        data:params,               
        success:function(data){
           //处理保存完毕后处理
        	if(data.code == "success"){ 
        		$('#add_buttons').css('display',"none");
        		$('#edit_buttons').css('display',"");
        		$('#w').window('open');
        		//console.log("row = "+data.rows);
        		showPayModAndBanks(data.rows,id_key);
        		showPayTimeLimits(data.rows,id_key);
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
//显示限制时间
function showPayTimeLimits(rows,code){
	//console.log("----------------- showPayTimeLimits start -----------------");
	var url = "paychannelslimit/search.dhtml" ; //cashierCode
	var id_key = "" ;
	var req_value = "{\"relevanceNo\":\"" + code + "\"}";
	//console.log("showPayTimeLimits req_value="+req_value);
	var params = jQuery.parseJSON(req_value) ; 
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        data:params,               
        success:function(data){
         	//console.log("----------------- showPayTimeLimits ajax start -----------------");
        	//console.log("showPayTypeNow data.code="+data.code);
        	//console.log("showPayTypeNow divId="+divId);
        	//console.log("data.code="+data.code);
           //处理保存完毕后处理
        	if(data.code == "success"){
        		 $.each(data.rows, function(i, obj) {
					//alert(obj.supplierName_colmun);
	        		 //console.log("obj.limitType="+obj.limitType);
	        		 //console.log("obj.startTime="+obj.startTime_colmun);
	        		 ////console.log("obj.endTime="+obj.endTime_colmun);
	        		 $("#limitType_a").combobox('select', obj.limitType);
	        		 $("#startTime_a").datetimebox('setValue',obj.startTime_colmun);
	        		 $("#endTime_a").datetimebox('setValue', obj.endTime_colmun);
	        		  //console.log("obj.startTime="+$("#startTime_a").datetimebox('getValue'));
	        		  //console.log("obj.endTime="+$("#endTime_a").datetimebox('getValue'));
				});
        	}else{
        		//console.log("message="+data.message);
        	}
        	//console.log("----------------- showPayTimeLimits ajax end -----------------");
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
     //console.log("----------------- showPayTimeLimits end -----------------");
}
//显示支付方式  + 银行
function showPayModAndBanks(rows,code){
	//console.log("showPayModAndBanks code = "+code);
	reset_clear();
	$.each(rows[0],function(k,v){
		//console.log(k+"="+v);
		//$("#"+k+"_a").textbox("setValue",v);
		if(k=="cashierName"){
			$("#"+k+"_a").textbox("setValue",v);
		}
		if(k=="status"){
			if("010"==v){
				$("input[name='status_a'][value=010]").click();
			}else if("020"==v){
				$("input[name='status_a'][value=020]").click();
			}
		}
		if(k=="payModeType"){
			//alert(v)
			var i_jk = v.indexOf("020");
			var i_wy = v.indexOf("010");
			var i_sm = v.indexOf("040");
			var i_pt = v.indexOf("050");
			var i_fq = v.indexOf("030");
			var i_qy = v.indexOf("060");
			var i_myb = v.indexOf("070");
			var i_df = v.indexOf("090");
			
			
			if(i_jk!=-1) $("#kjpagesort").val(i_jk/4+1);
			if(i_wy!=-1) $("#wypagesort").val(i_wy/4+1);
			if(i_sm!=-1) $("#smpagesort").val(i_sm/4+1);
			if(i_pt!=-1) $("#ptpagesort").val(i_pt/4+1);
			if(i_fq!=-1) $("#fqpagesort").val(i_fq/4+1);
			if(i_qy!=-1) $("#qypagesort").val(i_qy/4+1);
			if(i_myb!=-1) $("#mybpagesort").val(i_myb/4+1);
			if(i_df!=-1) $("#dfpagesort").val(i_df/4+1);
			
		   /* console.log(v.indexOf("010"));
		    console.log(v.indexOf("020"));
		    console.log(v.indexOf("030"));
		    console.log(v.indexOf("040"));
		    console.log(v.indexOf("050"));
		    console.log(v.indexOf("060"));
		    console.log(v.indexOf("070"));
		    */
			if(v.indexOf("010")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#wy").prop('checked','true');
				//快捷支付 借记卡
			    showPayTypeNow('010','010',code,'wy-jjk-show');
			    //快捷支付 贷记卡
			    showPayTypeNow('010','020',code,'wy-djk-show');
			}
			if(v.indexOf("020")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#kj").prop('checked','true');
				 //网银支付 借记卡
			    showPayTypeNow('020','010',code,'kj-jjk-show');
			    //网银支付 贷记卡
			    showPayTypeNow('020','020',code,'kj-djk-show');
			}
			if(v.indexOf("030")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#fq").prop('checked','true');
				showPayTypeNow('030','020',code,'fq-show');
			}
			if(v.indexOf("040")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#sm").prop('checked','true');
				showPayTypeNow('040','010',code,'sm-show');
				 
			}
			if(v.indexOf("050")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#pt").prop('checked','true');
				showPayTypeNow('050','010',code,'pt-show');
				 
			}
			if(v.indexOf("060")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#qy").prop('checked','true');
				showPayTypeNow('060','010',code,'qy-show');
			}
			if(v.indexOf("070")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#myb").prop('checked','true');
				showPayTypeNow('070','010',code,'myb-show');
			}
			if(v.indexOf("090")!=-1){
				//显示代付银行  并勾选快捷支付复选框 
				$("#df").prop('checked','true');
				showPayTypeNow('090','010',code,'df-show');
			}
		}
	});
}




//显示某个支付方式的支付银行
function showPayTypeNow(payMode,cardType,cashierCode,divId){ 
	var url = "cashierconfigdetail/searchList.dhtml" ; //cashierCode
	var id_key = "" ;
	//console.log("showPayTypeNow url="+url);
	var req_value = "{\"payMode\":\"" + payMode + "\",\"cardType\":\"" + cardType + "\",\"cashierCode\":\"" + cashierCode + "\"}";
	//console.log("showPayTypeNow req_value="+req_value);
	var params = jQuery.parseJSON(req_value) ; 
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        async:false,
        data:params,               
        success:function(data){
        	//console.log("showPayTypeNow data.code="+data.code);
        	//console.log("showPayTypeNow divId="+divId);
           //处理保存完毕后处理
        	if(data.code == "success"){
        		var t_bankName 	= "" ;
        		var t_bankCode 	= "" ;
				var t_pageSort 	= "" ;
				var t_payMode 	= "" ;
				var t_cardType 	= "" ;
        		$.each(data.rows, function(i, obj) {
					/*
					console.log("bankName_colmun="+obj.bankName_colmun);
					console.log("cashierCode_colmun="+obj.cashierCode_colmun);
					console.log("bankCode="+obj.bankCode);
					console.log("bankCode_colmun="+obj.bankCode_colmun);
					console.log("payMode="+obj.payMode);
					console.log("payMode_colmun="+obj.payMode_colmun);
					console.log("cardType_colmun="+obj.cardType_colmun);
					console.log("pageSort_colmun="+obj.pageSort_colmun);
					*/
					if(i!=0){
						t_bankName 	= t_bankName+"|"+obj.bankName_colmun ;
						t_bankCode 	= t_bankCode+","+obj.bankCode ;
						t_pageSort 	= t_pageSort+","+obj.pageSort ;
						t_cardType 	= t_cardType+","+obj.cardType ;
					}else{
						t_bankName 	= obj.bankName_colmun ;
						t_bankCode 	= obj.bankCode ;
						t_pageSort 	= obj.pageSort ;
						t_payMode 	= obj.payMode ;
						t_cardType 	= obj.cardType ;
					}
					
					var div_flag = divId.substring(0,2);
					/*$("#w-"+div_flag+"zf input[name='checkBank']").attr("checked",false);
					$("#w-"+div_flag+"zf input[name='checkBank']").each(function(){ 
						if($(this).attr("payMode") == obj.payMode){
							$("#w-kjzf input[name='checkBank']").attr("checked","false"); 
						}*/
					$("input[name='checkBank']").each(function(){ 
						
						if($(this).attr("bankCode") == obj.bankCode && $(this).attr("payMode") == obj.payMode && $(this).attr("cardType") == obj.cardType) {
							 $(this).attr("checked",true); 
							 var tId = $(this).attr("tId");
							 $("#" + tId).val(obj.pageSort);
						 }  
				    }) 
				   
					
				});
				$("#"+divId).html(t_bankName);
				//赋值
				//console.log(divId+"	:"+t_bankCode+"="+t_pageSort+"="+t_payMode+"="+t_cardType+"="+t_bankName);
				var prefix = divId.substring(0,divId.length-5);
				//console.log("prefix="+prefix);
				
				if("010"==payMode){
					if("010"==cardType){
						prefix = "wy_j_";
					}else if("020"==cardType){
						prefix = "wy_d_";
					}
				}
				if("020"==payMode){
					if("010"==cardType){
						prefix = "kj_j_";
					}else if("020"==cardType){
						prefix = "kj_d_";
					}	
				}
				$("#"+prefix+"bankCode").val(t_bankCode);
				$("#"+prefix+"pageSort").val(t_pageSort);
				$("#"+prefix+"payMode").val(t_payMode);
				$("#"+prefix+"cardType").val(t_cardType);
				/*
				console.log("update bankCode info="+ $("#"+prefix+"bankCode").val());
				console.log("update pageSort info="+ $("#"+prefix+"pageSort").val());
				console.log("update payMode info="+ $("#"+prefix+"payMode").val());
				console.log("update cardType info="+ $("#"+prefix+"cardType").val());
				*/
        	}else{
        		//console.log("message="+data.message);
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





//---------------------------view--------------------
function view_win_new(){
	var url = "cashierconfig/view.dhtml" ;
	var ck_v = $("#p input:checked");
	if(ck_v.length == 0){
		alert("请选择您所要查看的记录！");
		return ;
	}
	if(ck_v.length > 2){
		alert("每次只能查看一条记录！");
		return ;
	}
	
	var id_key = ck_v[0].value;
	if(ck_v.length == 2){
		if(ck_v[0].value!="on"){
			alert("每次只能查看一条记录！");
			return ;
		}
		id_key = ck_v[1].value;
	}
	
	var req_value = "{\"id_key\":\"" + id_key + "\"}";
	$("#cashierCode").val(id_key);
	var params=jQuery.parseJSON(req_value);
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        data:params,               
        success:function(data){
        	reset_clear();
           //处理保存完毕后处理
        	if(data.code == "success"){ 
        		//$('#add_buttons').css('display',"none");
        		$('#wq').window('open');
        		//console.log("row = "+data.rows);
        		showPayModAndBanks_view(data.rows,id_key);
        		showPayTimeLimits_view(data.rows,id_key);
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

function showPayModAndBanks_view(rows,code){
	//console.log("showPayModAndBanks_view code = "+code);
	//debugger;
	
	$.each(rows[0],function(k,v){
		
		if(v == null || v == "" ){
//			if(k=='limitType'||k=='startTime'||k=='endTime'){
//				$("#"+k+"_v").val("");
//			}else{
//				$("#"+k+"_v").text("");
//			}
			$("#"+k+"_v").val("");
		}else{
			$("#"+k+"_v").text(decodeURI(v));
		}
		
		if(k=="payModeType"){
			var i_jk = v.indexOf("020");
			var i_wy = v.indexOf("010");
			var i_sm = v.indexOf("040");
			var i_pt = v.indexOf("050");
			var i_fq = v.indexOf("030");
			var i_qy = v.indexOf("060");
			var i_myb = v.indexOf("070");
			var i_df = v.indexOf("090");
			
			
			if(i_jk!=-1) $("#kjpagesort_view").val(i_jk/4+1);
			if(i_wy!=-1) $("#wypagesort_view").val(i_wy/4+1);
			if(i_sm!=-1) $("#smpagesort_view").val(i_sm/4+1);
			if(i_pt!=-1) $("#ptpagesort_view").val(i_pt/4+1);
			if(i_fq!=-1) $("#fqpagesort_view").val(i_fq/4+1);
			if(i_qy!=-1) $("#qypagesort_view").val(i_qy/4+1);
			if(i_myb!=-1) $("#mybpagesort_view").val(i_myb/4+1);
			if(i_df!=-1) $("#dfpagesort_view").val(i_df/4+1);
			
		    //console.log(v.indexOf("010"));
		    //console.log(v.indexOf("020"));
		    //console.log(v.indexOf("030"));
		    //console.log(v.indexOf("040"));
		    //console.log(v.indexOf("050"));
		    //console.log(v.indexOf("060"));
		    //console.log(v.indexOf("070"));
		    
			if(v.indexOf("010")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#wy_view").prop('checked','true');
				//快捷支付 借记卡
			    showPayTypeNow('010','010',code,'wy-jjk-show_view');
			    //快捷支付 贷记卡
			    showPayTypeNow('010','020',code,'wy-djk-show_view');
			}else{
				$("#wy_tr").hide(); 
			}
			if(v.indexOf("020")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#kj_view").prop('checked','true');
				//网银支付 借记卡
			    showPayTypeNow('020','010',code,'kj-jjk-show_view');
			    //网银支付 贷记卡
			    showPayTypeNow('020','020',code,'kj-djk-show_view');
			}else{
				$("#kj_tr").hide(); 
			}
			if(v.indexOf("030")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#fq_view").prop('checked','true');
				showPayTypeNow('030','020',code,'fq-show_view');
			}else{
				$("#fq_tr").hide();
			}
			if(v.indexOf("040")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#sm_view").prop('checked','true');
				showPayTypeNow('040','010',code,'sm-show_view');
			}else{
				$("#sm_tr").hide();
			}
			if(v.indexOf("050")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#pt_view").prop('checked','true');
				showPayTypeNow('050','010',code,'pt-show_view');
			}else{
				$("#pt_tr").hide();
			}
			if(v.indexOf("060")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#qy_view").prop('checked','true');
				showPayTypeNow('060','010',code,'qy-show_view');
			}else{
				$("#qy_tr").hide();
			}
			if(v.indexOf("070")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#myb_view").prop('checked','true');
				showPayTypeNow('070','010',code,'myb-show_view');
			}else{
				$("#myb_tr").hide();
			}
			
			if(v.indexOf("090")!=-1){
				//显示快捷支付银行  并勾选快捷支付复选框 
				$("#df_view").prop('checked','true');
				showPayTypeNow('090','010',code,'df-show_view');
			}else{
				$("#df_tr").hide();
			}
		}
	});
}
//显示限制时间
function showPayTimeLimits_view(rows,code){
	//console.log("----------------- showPayTimeLimits start -----------------");
	var url = "paychannelslimit/search.dhtml" ; //cashierCode
	var id_key = "" ;
	var req_value = "{\"relevanceNo\":\"" + code + "\"}";
	//console.log("showPayTimeLimits req_value="+req_value);
	var params = jQuery.parseJSON(req_value) ; 
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        data:params,               
        success:function(data){
         	//console.log("----------------- showPayTimeLimits ajax start -----------------");
        	//console.log("showPayTypeNow data.code="+data.code);
        	//console.log("showPayTypeNow divId="+divId);
        	//console.log("data.code="+data.code);
           //处理保存完毕后处理
        	if(data.code == "success"){
        		 $.each(data.rows, function(i, obj) {
					//alert(obj.supplierName_colmun);
	        		 //console.log("obj.limitType="+obj.limitType);
	        		 //console.log("obj.startTime="+obj.startTime_colmun);
	        		 //console.log("obj.endTime="+obj.endTime_colmun);
	        		 $("#limitType_v").combobox('select', obj.limitType);
	        		 $("#startTime_v").datetimebox('setValue',obj.startTime_colmun);
	        		 $("#endTime_v").datetimebox('setValue', obj.endTime_colmun);
	        		  //console.log("obj.startTime="+$("#startTime_a").datetimebox('getValue'));
	        		  //console.log("obj.endTime="+$("#endTime_a").datetimebox('getValue'));
				});
        	}else{
        		//console.log("message="+data.message);
        	}
        	//console.log("----------------- showPayTimeLimits ajax end -----------------");
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
     //console.log("----------------- showPayTimeLimits end -----------------");
}
function reset_clear(){
	$("#kj").removeAttr('checked');
	$("#wy").removeAttr('checked');
	$("#sm").removeAttr('checked');
	$("#pt").removeAttr('checked');
	$("#fq").removeAttr('checked');
	$("#qy").removeAttr('checked');
	$("#myb").removeAttr('checked');
	$("#df").removeAttr('checked');
	
	
	$("#limitType_a").combobox('select', '');
	$("#startTime_a").datetimebox('setValue', '');
	$("#endTime_a").datetimebox('setValue', '');
	
	$("#kj-jjk-show").html('');
	$("#kj-djk-show").html('');
	$("#wy-jjk-show").html('');
	$("#wy-djk-show").html('');
	
	$("#sm-show").html('');
	$("#pt-show").html('');
	$("#fq-show").html('');
	$("#qy-show").html('');
	$("#myb-show").html('');
	$("#df-show").html('');
	/*
	$("#kjpagesort").val('');
	$("#wypagesort").val('');
	$("#smpagesort").val('');
	$("#ptpagesort").val('');
	$("#fqpagesort").val('');
	$("#qypagesort").val('');
	$("#mybpagesort").val('');
	*/
	$("#kj_j_bankCode").val('');
	$("#kj_j_pageSort").val('');
	$("#kj_j_payMode").val('');
	$("#kj_j_cardType").val('');
	
	$("#kj_d_bankCode").val('');
	$("#kj_d_pageSort").val('');
	$("#kj_d_payMode").val('');
	$("#kj_d_cardType").val('');
	
	$("#wy_j_bankCode").val('');
	$("#wy_j_pageSort").val('');
	$("#wy_j_payMode").val('');
	$("#wy_j_cardType").val('');
	
	$("#wy_d_bankCode").val('');
	$("#wy_d_pageSort").val('');
	$("#wy_d_payMode").val('');
	$("#wy_d_cardType").val('');
	
	$("#smbankCode").val('');
	$("#smpageSort").val('');
	$("#smpayMode").val('');
	$("#smcardType").val('');
	
	$("#ptbankCode").val('');
	$("#ptpageSort").val('');
	$("#ptpayMode").val('');
	$("#ptcardType").val('');
	
	$("#fqbankCode").val('');
	$("#fqpageSort").val('');
	$("#fqpayMode").val('');
	$("#fqcardType").val('');
	
	$("#qybankCode").val('');
	$("#qypageSort").val('');
	$("#qypayMode").val('');
	$("#qycardType").val('');
	
	$("#mybbankCode").val('');
	$("#mybpageSort").val('');
	$("#mybpayMode").val('');
	$("#mybcardType").val('');
	
	$("#dfbankCode").val('');
	$("#dfpageSort").val('');
	$("#dfpayMode").val('');
	$("#dfcardType").val('');
	
	
	$("#kj_view").removeAttr('checked');
	$("#wy_view").removeAttr('checked');
	$("#sm_view").removeAttr('checked');
	$("#pt_view").removeAttr('checked');
	$("#fq_view").removeAttr('checked');
	$("#qy_view").removeAttr('checked');
	$("#myb_view").removeAttr('checked');
	$("#df_view").removeAttr('checked');
	
	
	$("#kjpagesort_view").val('');
	$("#wypagesort_view").val('');
	$("#smpagesort_view").val('');
	$("#ptpagesort_view").val('');
	$("#fqpagesort_view").val('');
	$("#qypagesort_view").val('');
	$("#mybpagesort_view").val('');
	$("#dfpagesort_view").val('');
	
	$("#limitType_v").combobox('select', '');
	$("#startTime_v").datetimebox('setValue', '');
	$("#endTime_v").datetimebox('setValue', '');
	
}
function reset_view_clear(divId){
	$("#"+divId+" input[type=checkbox]").removeAttr('checked');
}



//------------------------------------------------------------------------
function selectAll(divId,t){
	var c=$(t).is(':checked');
    if(c){
		$("#"+divId+" input[type=checkbox]").prop('checked','true');
    }else{
    	$("#"+divId+" input[type=checkbox]").removeAttr('checked');
    }
}
function params_str(queryParams){
	queryParams.cashierCode = $("#cashierCode_q").textbox("getValue").replace("%"," ");
	queryParams.cashierName = $("#cashierName_q").textbox("getValue").replace("%"," ");
	//queryParams.status = $("input[name='menuStatus_q']:checked").val();
	queryParams.status = $("#status_q").combobox("getValue");
}
function form_clear(){
	$("#id").val("");
	$("#cashierCode_a").textbox("setValue","");
	$("#cashierCode_a_m").css("display","none");
	$("#cashierName_a").textbox("setValue","");
	$("#cashierName_a_m").css("display","none");
	$("#payModeType_a").textbox("setValue","");
	$("#payModeType_a_m").css("display","none");
	$("#bankCount_a").textbox("setValue","");
	$("#bankCount_a_m").css("display","none");
	$("#startTime_a").textbox("setValue","");
	$("#startTime_a_m").css("display","none");
	$("#endTime_a").textbox("setValue","");
	$("#endTime_a_m").css("display","none");
	$("input[name='status_a'][value=010]").click();
	$("#status_a_m").css("display","none");
	$("#upPerson_a").textbox("setValue","");
	$("#upPerson_a_m").css("display","none");
}
function add_function(val,row){ 
	return "操作功能"; 
}
//  
function showPaySupplierInfo(divId){ 
	var url = "paysupplierinfo/search.dhtml" ; 
	var req_value = "";
	var params = "" ; 
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        data:params,               
        success:function(data){
        	//console.log("showPaySupplierInfo data.code="+data.code);
           //处理保存完毕后处理
        	if(data.code == "success"){
        		var supplierName = "" ;
        		$.each(data.rows, function(i, obj) {
					//alert(obj.supplierName_colmun);
					 
					if(i!=0){
						supplierName = supplierName+"|"+obj.supplierName_colmun ;
					}else{
						supplierName = obj.supplierName_colmun ;
					}
					$("#"+divId).html(supplierName);
					 
				});
        		//alert(data.rows);
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
function showBankForSupplierSupport(payMode,cardType,divId){ 
	var url = "cashierconfig/showBanksByPayMode.dhtml" ; 
	var id_key = "" ;
	var req_value = "{\"payMode\":\"" + payMode + "\",\"cardType\":\"" + cardType + "\"}";
	//alert(req_value)
	var params = jQuery.parseJSON(req_value) ; 
	$.ajax({  
        type:"POST",  
        url:url,
        timeout:6000,
        dataType:'json',
        data:params,               
        success:function(data){
        	//alert(data.code);
           //处理保存完毕后处理 "+obj.bankName_colmun+"
        	if(data.code == "success"){
        		//$("#"+divId).empty();
        		var bankName = "" ;
				var html = "";
				//var div_flag = divId.substring(0,2);
				//$("#w-"+div_flag+"zf input[name='checkBank']").attr("checked",false);
        		$.each(data.rows, function(i, obj) {
					var index = data.rows.length-i;
					var tId = divId+obj.bankCode+index;
					var checkbox = "<input type='checkbox' id='"+obj.bankCode+"' tId='"+ tId +"'  payMode = '"+ obj.payMode +"' cardType='"+ obj.cardType +"' bankCode='"+obj.bankCode+"' bankName='"+obj.bankName+"' name='checkBank'   index='"+(index)+"'/>" ; 
					
					html =  "<tr class='tr2'><td><input type='text' value='"+(index)+"' id='"+tId+"'/></td><td>"+obj.bankName_colmun+"</td><td>"+checkbox+"</td></tr>";
					$("#"+divId+" tr:eq(0)").after(html);
				});
        		//alert($("#"+divId).html());
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




//保存快捷支付 - 网银支付  详细信息
function saveKj_wyDetailInfo(divId,prefix){
	var jjk_bankCode = "" ;
	var jjk_bankName = "" ;
	var jjk_pageSort = "" ;
	var jjk_payMode = "" ;
	var jjk_cardType = "" ;
	
	
	var djk_bankCode = "" ;
	var djk_bankName = "" ;
	var djk_pageSort = "" ;
	var djk_payMode = "" ;
	var djk_cardType = "" ;
	
	var flag = false; //是否填写排序
	
	var j_ck_v =  $("#"+divId+" #"+prefix+"_jjktable input:checked:not(#all)")
	var d_ck_v =  $("#"+divId+" #"+prefix+"_djktable input:checked:not(#all)")
	$.each(j_ck_v,function(i,obj){
		var t_j_bankCode = $(this).attr("bankCode");
		var t_j_bankName = $(this).attr("bankName");
		var t_j_index = $(this).attr("index");
		var pageSortId = prefix+"_jjktable"+t_j_bankCode+t_j_index;
		var t_pageSort=$("#"+pageSortId).val();
		if(t_pageSort == ''){
			flag = true;
			return;
		}
		jjk_bankCode += t_j_bankCode +",";
		jjk_bankName += t_j_bankName +",";
		jjk_pageSort += t_pageSort +",";
		jjk_payMode += "010" +",";
		jjk_cardType += "010" +",";
	});
	
	var ary = jjk_pageSort.split(",");
	if(isRepeat(ary)){
		alert("序号填写重复，请重新填写！");  
		return;
	}

	if(flag){
		alert("请填写排序!");
		return;
	}
	
	//排序
	var jjkSortArr = jjk_pageSort.split(",");
	var jjkBankCodeArr = jjk_bankCode.split(",");
	var jjkBankNameArr = jjk_bankName.split(",");
	var jjkSortArr2 = jjk_pageSort.split(",");
	
	
	var jjk_bankNameAllArr = "";
	var jjk_bankCodeAllArr = "";
	var jjkSortAllArr = "";
	var jjkBankNameArrStr = "";

	jjkSortArr2.sort(function(a,b){return a-b});


	for(var i = 0; i < jjkSortArr2.length; i++){
		for(var j = 0; j < jjkSortArr.length; j++){
			if(jjkSortArr2[i] == jjkSortArr[j] && jjkSortArr2[i] != '' && jjkSortArr[j] != ''){
				jjk_bankNameAllArr += jjkBankNameArr[j] + ",";
				jjk_bankCodeAllArr += jjkBankCodeArr[j] + ","
				jjkSortAllArr += jjkSortArr[j] + ",";
				
				if(jjkBankNameArrStr == ""){
					jjkBankNameArrStr = jjkBankNameArr[j]
				}else{
					jjkBankNameArrStr += "|" +jjkBankNameArr[j] ;
				}
				
			}
		}
	}

	jjk_bankCode = jjk_bankCodeAllArr
	jjk_bankName = jjk_bankNameAllArr
	jjk_pageSort = jjkSortAllArr
	
	
	jjk_bankCode = jjk_bankCode.substring(0,jjk_bankCode.length-1);
	jjk_bankName = jjk_bankName.substring(0,jjk_bankName.length-1);
	jjk_pageSort = jjk_pageSort.substring(0,jjk_pageSort.length-1);
	jjk_payMode  = jjk_payMode.substring(0,jjk_payMode.length-1);
	jjk_cardType = jjk_cardType.substring(0,jjk_cardType.length-1);
	//console.log(prefix+"a:"+jjk_bankCode+"="+jjk_pageSort+"="+jjk_payMode+"="+jjk_cardType+"="+jjk_bankName);
	
	$("#"+prefix+"-jjk-show").html(jjkBankNameArrStr);
	
	$("#"+prefix+"_j_bankCode").val(jjk_bankCode);
	$("#"+prefix+"_j_pageSort").val(jjk_pageSort);
	$("#"+prefix+"_j_payMode").val(jjk_payMode);
	$("#"+prefix+"_j_cardType").val(jjk_cardType);
	//console.log("============"+$("#"+prefix+"_j_bankCode").val());
	$.each(d_ck_v,function(i,obj){
		var t_d_bankCode = $(this).attr("bankCode");
		var t_d_bankName = $(this).attr("bankName");
		var t_d_index = $(this).attr("index");
		var pageSortId = prefix+"_djktable"+t_d_bankCode+t_d_index;
		var t_pageSort=$("#"+pageSortId).val();
		if(t_pageSort === ''){
			flag = true;
			return;
		}
		djk_bankCode += t_d_bankCode +",";
		djk_bankName += t_d_bankName +",";
		djk_pageSort += t_pageSort +",";
		djk_payMode += "020" +",";
		djk_cardType += "020" +",";
	});
	
	var ary = djk_pageSort.split(",");
	if(isRepeat(ary)){
		alert("序号填写重复，请重新填写！");
		return;
	}
	if(flag){
		alert("请填写排序!");
		return;
	}
	//排序
	var djk_bankCodeArr = djk_bankCode.split(",");
	var djk_bankNameArr = djk_bankName.split(",");
	var djk_pageSortArr = djk_pageSort.split(",");
	var djk_pageSortArr2 = djk_pageSort.split(",");
	

	djk_pageSortArr2.sort(function(a,b){return a-b});


	var djk_bankCodeAllArr = "";
	var djk_bankNameAllArr = "";
    var djk_pageSortAllArr = "";
    var djk_bankCodeAllArrStr = "";

	for(var i = 0; i < djk_pageSortArr2.length; i++){
		for(var j = 0; j < djk_pageSortArr.length; j++){
			if(djk_pageSortArr2[i] == djk_pageSortArr[j] && djk_pageSortArr2[i] != '' && djk_pageSortArr[j] != ''){
				djk_bankNameAllArr += djk_bankNameArr[j] + ",";
				djk_bankCodeAllArr += djk_bankCodeArr[j] + ","
				djk_pageSortAllArr += djk_pageSortArr[j] + ",";
				
				if(djk_bankCodeAllArrStr == ""){
					djk_bankCodeAllArrStr = djk_bankNameArr[j]
				}else{
					djk_bankCodeAllArrStr += "|" +djk_bankNameArr[j] ;
				}
				
			}
		}
	}
	
	djk_bankCode = djk_bankCodeAllArr;
	djk_bankName = djk_bankNameAllArr;
	djk_pageSort = djk_pageSortAllArr;
	
	djk_bankCode = djk_bankCode.substring(0,djk_bankCode.length-1);
	djk_bankName = djk_bankName.substring(0,djk_bankName.length-1);
	djk_pageSort = djk_pageSort.substring(0,djk_pageSort.length-1);
	djk_payMode  = djk_payMode.substring(0,djk_payMode.length-1);
	djk_cardType = djk_cardType.substring(0,djk_cardType.length-1);
	//console.log(prefix+"b:"+djk_bankCode+"="+djk_pageSort+"="+djk_payMode+"="+djk_cardType+"="+djk_bankName);
	$("#"+prefix+"-djk-show").html(djk_bankCodeAllArrStr);
	
	$("#"+prefix+"_d_bankCode").val(djk_bankCode);
	$("#"+prefix+"_d_pageSort").val(djk_pageSort);
	$("#"+prefix+"_d_payMode").val(djk_payMode);
	$("#"+prefix+"_d_cardType").val(djk_cardType);
	
	//alert("添加成功！");
	$("#w-"+prefix+"zf").window("close");
}



//保存 详细信息
function saveDetailInfo(divId,prefix,p_payMode,p_cardType){
	var bankCode = "" ;
	var bankName = "" ;
	var index = "" ;
	
	var pageSort = "" ;
	var payMode = "" ;
	var cardType = "" ;
	var j_ck_v =  $("#"+divId+" #"+prefix+"table input:checked:not(#all)")
	$.each(j_ck_v,function(i,obj){
		var t_bankCode = $(this).attr("bankCode");
		var t_bankName = $(this).attr("bankName");
		var t_index = $(this).attr("index");
		var pageSortId = prefix+"table"+t_bankCode+t_index;
		var t_pageSort=$("#"+pageSortId).val();
		
		bankCode += t_bankCode +",";
		bankName += t_bankName +",";
		pageSort += t_pageSort +",";
		payMode += p_payMode +",";
		cardType += p_cardType +",";
	});
	if(!pageSort==""){
		if(isRepeat(pageSort.split(","))){
			alert("序号填写重复，请重新填写！");  
			return;
		}
	}
	
	//排序
	var bankCodeArr = bankCode.split(",");
	var bankNameArr = bankName.split(",");
	var pageSortArr = pageSort.split(",");
	var pageSortArr2 = pageSort.split(",");
	

	pageSortArr2.sort(function(a,b){return a-b});


	var bankCodeAllArr = "";
	var bankNameAllArr = "";
    var pageSortAllArr = "";
    var bankNameAllArrStr = "";

	for(var i = 0; i < pageSortArr2.length; i++){
		for(var j = 0; j < pageSortArr.length; j++){
			if(pageSortArr2[i] == pageSortArr[j] && pageSortArr2[i] != '' && pageSortArr[j] != ''){
				bankNameAllArr += bankNameArr[j] + ",";
				bankCodeAllArr += bankCodeArr[j] + ","
				pageSortAllArr += pageSortArr[j] + ",";
				
				if(bankNameAllArrStr == ""){
					bankNameAllArrStr = bankNameArr[j]
				}else{
					bankNameAllArrStr += "|" +bankNameArr[j] ;
				}
				
			}
		}
	}
	
	bankCode = bankCodeAllArr;
	bankName = bankNameAllArr;
	pageSort = pageSortAllArr;
	
	
	
	bankCode = bankCode.substring(0,bankCode.length-1);
	bankName = bankName.substring(0,bankName.length-1);
	pageSort = pageSort.substring(0,pageSort.length-1);
	payMode = payMode.substring(0,payMode.length-1);
	cardType = cardType.substring(0,cardType.length-1);
	
	//console.log("c:"+bankCode+"="+pageSort+"="+payMode+"="+cardType+"="+bankName);
	$("#"+prefix+"-show").html(bankNameAllArrStr);
	
	$("#"+prefix+"bankCode").val(bankCode);
	$("#"+prefix+"pageSort").val(pageSort);
	$("#"+prefix+"payMode").val(payMode);
	$("#"+prefix+"cardType").val(cardType);
	//alert("添加成功！");
	$("#w-"+prefix+"zf").window("close");
}
//判断数组中是否重复元素
//验证重复元素，有重复返回true；否则返回false
 
function isRepeat(a){
	//return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+a.join("\x0f\x0f") +"\x0f");    //该方法只支持0-9的数字，不推荐使用
	var nary=a.sort();
	var is_repeat = false;
	for(var i=0;i<nary.length;i++){
		if (nary[i]==nary[i+1]){
			is_repeat = true;
		}
	}
	return is_repeat;
}
 