/**
 * Created by Gert on 01/01/2017.
 * node server at: http://192.168.1.142:3000/
 * example code: http://socket.io/get-started/chat/
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var socket;

io.on('connection', function(socket_){
	socket = socket_;
	console.log('a user connected!');
	socket.on('disconnect', function(){
		console.log('user disconnected!');
	});
	socket.on('reminders', function(msg){
		io.emit('reminders', msg);
	});
	socket.on('reload', function(msg){
		io.emit('reload', msg);
	});
	socket.on('color', function(msg){
		io.emit('color', msg);
	});

});

//setInterval(function(){
//	socket.broadcast.emit('reminders', new Date().getMilliseconds());
//}, 3000);


http.listen(3000, function(){
	console.log('listening on *:3000');
});