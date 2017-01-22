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
    }
    Editor.prototype.getReminderData = function (jsonFn) {
        var _this = this;
        $.ajax(jsonFn + "?" + Math.random(), { dataType: "json" })
            .done(function (json) { return _this.onJsonLoaded(json); });
    };
    Editor.prototype.onJsonLoaded = function (remindersArray) {
        var passedHtml = "";
        var upcomingHtml = "";
        for (var _i = 0; _i < remindersArray.length; _i++) {
            var reminderJson = remindersArray[_i];
            var reminder = new Reminder(reminderJson);
            this.reminders.push(reminder);
            if (reminder.isActive) {
                upcomingHtml += reminder.toHtml();
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