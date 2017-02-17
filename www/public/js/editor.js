///<reference path="../../node_modules/@types/jquery/index.d.ts"/>
/**
 * Created by Gert on 18/01/2017.
 */
var Editor = (function () {
    function Editor($body) {
        this._$body = $body;
        this._$tabContentPassed = $("#fixed-tab-passed > .page-content");
        this._$tabContentUpcoming = $("#fixed-tab-upcoming > .page-content");
        this.reminders = [];
        this.getReminderData("reminders.json");
        //init socket
        this.socket = io();
        this.socket.on('reminder', function (data) { return function (data) {
            if (data.task == "hide") {
                document.reload();
            }
        }; });
        this.socket.on('reload', function (msg) {
            window.location.reload();
        });
    }
    Editor.prototype.getReminderData = function (jsonFn) {
        var _this = this;
        $.ajax(jsonFn + "?" + Math.random(), { dataType: "json" })
            .done(function (json) { return _this.onJsonLoaded(json); });
    };
    Editor.prototype.onJsonLoaded = function (remindersArray) {
        var passedHtml = "";
        var upcomingHtml = "";
        var lastDate = new Date("1970/1/1");
        for (var _i = 0; _i < remindersArray.length; _i++) {
            var reminderJson = remindersArray[_i];
            var reminder = new Reminder(this.socket, reminderJson);
            this.reminders.push(reminder);
            if (!reminder.isPassed) {
                if (lastDate.getTime() > reminder.triggerDate.getTime()) {
                    upcomingHtml = reminder.toHtml() + upcomingHtml;
                }
                else {
                    upcomingHtml = upcomingHtml + reminder.toHtml();
                }
                lastDate = reminder.triggerDate;
            }
            else {
                passedHtml += reminder.toHtml();
            }
        }
        this._$tabContentUpcoming.html(upcomingHtml);
        this._$tabContentPassed.html(passedHtml);
    };
    return Editor;
})();
//# sourceMappingURL=editor.js.map