/**
 * Created by Gert on 13/01/2017.
 */


var lastBlink = false;

var $reminders = $("#reminders");


function leadingZero(n) {
	return n < 10 ? "O" + n : n.toString();
}

function blink() {
	lastBlink = !lastBlink;
	if (lastBlink) {
		return "<span style='color: black'>:</span>"
	} else {
		return "<span style='color: #ff6c4e'>:</span>"
	}

}
function minus12(hours) {
	return (hours > 12) ? hours - 12 : hours
}
function updateClock() {
	var days = ["jan", "feb" , "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
	var now = new Date();
	var html = minus12(now.getHours()) + blink() + leadingZero(now.getMinutes()) ;
	$(".time").html(html);
	html = leadingZero(now.getDate()) + " " + days[now.getMonth()] ;
	$(".date").html(html);
}

function weather() {

	$.simpleWeather({
		location: 'Antwerpen, Belgium',
		woeid: '',
		unit: 'c',
		success: function(weather) {
			html = '<i class="icon-'+weather.code+'"></i>';
			html += weather.temp+'&deg;'+weather.units.temp+'';


			$(".weather-icon i").removeClass().addClass("icon-" + weather.code);
			$(".weather-temp").html(weather.temp + "&deg;" + weather.units.temp);
		},
		error: function(error) {
			$("#weather").html('<p>'+error+'</p>');
		}
	});

}

function initReminders(){

	$.ajax("reminders.json?" + Math.random(),{dataType:"json"})
		.done(function(fullJson) {

			for (var i in fullJson) {
				var triggerDate = new Date(fullJson[i].triggerDate);
				if (triggerDate.getTime() <= new Date().getTime() && fullJson[i].done != "true") {
					createReminder(fullJson[i]);
				} else {
					if (triggerDate.getTime() > new Date().getTime() && fullJson[i].done == "false") {
						//plan event
						var delay = triggerDate.getTime() - new Date().getTime();
						setTimeout(function() {
							createReminder(fullJson[i])
						}, delay);
					}
				}
			}

		});

	function createReminder(reminderJson) {
		$("#reminders").append('' +
			'<li class="reminder blink_me" data-id="' + reminderJson.id + '" style="background-color:' + reminderJson.color + ';">' + reminderJson.label + '</li>');
		$(".reminder[data-id='" + reminderJson.id + "']").on("click", function(e){
			socket.emit("reminder", {task: "hide", id: $(e.currentTarget).data("id")});
		});
	}
}



function togglePillWarning() {
	$reminder.toggle();
}


weather();
setInterval(weather, 1000 * 60 * 10  ); //each 10 minutes
updateClock();
setInterval(updateClock, 1000); //each second
initReminders();

var socket = io();

socket.on('reminder', function(data){
	if (data.task = "hide") {
		$reminders.find(".reminder[data-id='" + data.id + "']").remove();
	}
});

socket.on('reload', function(msg){
	window.location.reload();
});

socket.on('color', function(data){
	//$reminder.css("background-color", data);
});




setInterval(function() {
	window.location.reload();
}, 1000 * 60 * 60); //reload each hour


//make full screen on click
/*
 addEventListener("click", function() {
 var el = document.documentElement;
 var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
 rfs.call(el);
 });
 */

//reload all clients on click
addEventListener("click", function() {
	socket.emit("reload", "")
});
