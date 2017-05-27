function add_params_validate(url,ddl){
	//验证是否禁用 银行  弹出提示    ， 禁用银行将导致所有关联该银行的配置失效，是否继续？
	var  status = $("input[name='status_a']:checked").val();
	console.log("status="+status);
	console.log("url="+url);
	console.log("ddl="+ddl);
	if(status=='020'){
		 $.messager.confirm('确认', "禁用银行将导致所有关联该银行的配置失效，是否继续？", function(r) {
            if(r){
            	add_params(url,ddl);
            }
         });   
	}else{
		add_params(url,ddl);
	}
}

