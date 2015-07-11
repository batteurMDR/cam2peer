var login = {

	is : function(){
		var user = sessionStorage.getItem("user");
		if(user==null){
			return false;
		}else{
			return true;
		}
	}

}