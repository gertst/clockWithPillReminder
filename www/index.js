/**
 * Created by Gert on 01/01/2017.
 * node server at: http://192.168.1.142:3000/
 * example code: http://socket.io/get-started/chat/
 */

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

var socket;

io.on('connection', function(socket_){
	socket = socket_;
	console.log('a user connected!');
	socket.on('disconnect', function(){
		console.log('user disconnected!');
	});
	socket.on('reminder', function(socketData){
		io.emit('reminder', socketData);
		if (socketData.task == "hide") {
			var fs = require('fs')
			var data = fs.readFileSync(__dirname + '/public/reminders.json');
			var json = JSON.parse(data);
			for (var i in json) {
				if (json[i].id == socketData.id) {
					console.log("id " + socketData.id + " found.");

					if (json[i].frequency != "once") {
						var date = new Date(json[i].triggerDate);
						if (json[i].frequency == "daily") {
							date.setDate(date.getDate() + 1);
						} else if (json[i].frequency == "weekly") {
							date.setDate(date.getDate() + 7);
						} else if (json[i].frequency == "hourly") {
							date.setHours(date.getHours() + 1);
						}
						json[i].triggerDate = date.toISOString();
					} else {
						json[i].done = "true";
					}
					break;
				}
			}
			fs.writeFile(__dirname + '/public/reminders.json', JSON.stringify(json, null, 2), function(err) {
				if(err) {
					return console.log(err);
				} else {
					console.log("save for id " + socketData.id + " done")
				}

			});

		}
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
