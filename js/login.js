var login = {

	is : function(){
		var user = sessionStorage.getItem("username");
		if(user==null){
			return false;
		}else{
			return true;
		}
	},

	login : function(socket,username){
		socket.emit("checkusername",{username:username});
		socket.on("checkusername_error",function(){
            alert("Nom d'utilisateur indisponible");
		});
		socket.on("checkusername_ok",function(id){
            sessionStorage.setItem('username',username);
            sessionStorage.setItem('id',id);
			window.location = "index.html";
		});
	}

}