$(function(){
	if(!login.is()){
		window.location = "login.html";
	}
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	var nw = require('nw.gui');
   	var windowMenu = new nw.Menu({
      	type: 'menubar'
   	});
    windowMenu.createMacBuiltin("Cam2Peer");
    nw.Window.get().menu = windowMenu;
    var socket = io.connect("http://92.222.40.146:6650");
    socket.on('error',function(message){ 
        console.log(message);
    });
    var username = sessionStorage.getItem("username");
    var peer = new Peer({key:"slun34lmsidrhpvi"});
    peer.on('open', function(){
        $('#my-id').append(username);
        socket.emit("setppid",{username:username,ppid:peer.id});
    });
    peer.on('error', function(err){
      alert(err.message);
    });
    navigator.getUserMedia({audio:true,video:true},function(stream){
        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
    },function(){ 
        alert('Erreur'); 
    });
    $('form').submit(function(e){
        e.preventDefault();
        var callto = $('#username').val();
        call(peer,socket,callto);
    });
    peer.on('call', function(call){
        answer(call,function(){
            $('.answer').fadeOut();
            window.existingCall.close();
        },function(){
            $('.answer').hide();
            call.answer(window.localStream);
            receive_call(peer,call);
        });
    });
});
function answer(call,error,success){
    $('.answer').show();
    $('.yes').click(function(e){
        e.preventDefault();
        success();
    });
    $('.no').click(function(e){
        e.preventDefault();
        error();
    });
}
function call(peer,socket,username){
    socket.emit("getppid",{username:username});
    socket.on('getppid',function(d){
        if(d.error==0){
            var call = peer.call(d.ppid, window.localStream);
            if(window.existingCall){
                window.existingCall.close();
            }
            call.on('stream',function(stream){
                $('#their-video').prop('src', URL.createObjectURL(stream));
            });
            window.existingCall = call;
            moviemod();
        }else{
            alert('Utilisateur introuvable');
        }
    });
}
function receive_call(peer,call){
    if (window.existingCall){
        window.existingCall.close();
    }
    call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });
    window.existingCall = call;
    moviemod();
}
function moviemod(){
    $('#video-container').fadeIn();
}
function normalmod(){
    $('#video-container').fadeOut();
}