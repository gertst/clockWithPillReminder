/**
 * Created by Gert on 21/01/2017.
 */
var Frequency;
(function (Frequency) {
    Frequency[Frequency["Once"] = 0] = "Once";
    Frequency[Frequency["EachMinute"] = 1] = "EachMinute";
    Frequency[Frequency["Hourly"] = 2] = "Hourly";
    Frequency[Frequency["Daily"] = 3] = "Daily";
    Frequency[Frequency["Weekly"] = 4] = "Weekly";
    Frequency[Frequency["Monthly"] = 5] = "Monthly";
    Frequency[Frequency["Yearly"] = 6] = "Yearly";
})(Frequency || (Frequency = {}));
var Reminder = (function () {
    /**
     * {
        "id": "1",
        "user": "Gert",
        "label": "Pillen",
        "color": "#ff6c4e",
        "triggerDate": "2017-01-20T18:00:00.000Z",
        "frequency": "daily",
        "done": "false"
      }
     * @param reminderJson
     */
    function Reminder(socket, reminderJson) {
        var _this = this;
        this.locale = "nl-BE";
        this.socket = socket;
        this.id = reminderJson.id;
        this.user = reminderJson.user;
        this.label = reminderJson.label;
        this.color = reminderJson.color;
        this.triggerDate = new Date(reminderJson.triggerDate);
        this.frequency = reminderJson.frequency;
        this.done = (reminderJson.done == 'true');
        if (!this.done) {
            if (this.triggerDate.getTime() <= new Date().getTime()) {
                setTimeout(function () {
                    _this.createReminder();
                }, 1000);
            }
            else {
                if (this.triggerDate.getTime() > new Date().getTime()) {
                    //plan event
                    var delay = this.triggerDate.getTime() - new Date().getTime();
                    setTimeout(function () {
                        _this.createReminder();
                    }, delay);
                }
            }
        }
    }
    Reminder.prototype.createReminder = function () {
        $("#reminder-" + this.id).find(".btn-dismiss").removeClass("hide");
        $("#reminder-" + this.id).find(".reminder-card").addClass("triggered");
    };
    Object.defineProperty(Reminder.prototype, "isPassed", {
        get: function () {
            return (this.triggerDate.getTime() < new Date().getTime() && this.done);
        },
        enumerable: true,
        configurable: true
    });
    Reminder.prototype.toHtml = function () {
        var _this = this;
        var template = $('#templateReminder').html();
        Mustache.parse(template); // optional, speeds up future uses
        setTimeout(function () { _this.init(); }, 100);
        return Mustache.render(template, this);
    };
    Reminder.prototype.userLower = function () {
        return this.user.toLowerCase();
    };
    /**
     * eg: 17 May
     * @returns {string}
     */
    Reminder.prototype.formatDate = function () {
        var options = { day: 'numeric', month: 'short' };
        return this.triggerDate.toLocaleDateString(this.locale, options);
    };
    /**
     * eg: 6PM
     * @returns {string}
     */
    Reminder.prototype.formatHour = function () {
        var options = { date: "", hour: 'numeric', minute: "2-digit" };
        return this.triggerDate.toLocaleTimeString(this.locale, options);
    };
    Reminder.prototype.dateDay = function () {
        return this.relativeDayFormat(this.triggerDate);
    };
    /*
     If the date is:
     Today - show as "Today";
     Tomorrow - show as "Tomorrow"
     Yesterday - show as "Yesterday"
     Else - show "Mon", "Tue", ...
     */
    Reminder.prototype.relativeDayFormat = function (date) {
        var strDate = "";
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear()) {
            strDate = "Today";
        }
        else if (yesterday.getDate() == date.getDate() && yesterday.getMonth() == date.getMonth() && yesterday.getFullYear() == date.getFullYear()) {
            strDate = "Yesterday";
        }
        else if (tomorrow.getDate() == date.getDate() && tomorrow.getMonth() == date.getMonth() && tomorrow.getFullYear() == date.getFullYear()) {
            strDate = "Tomorrow";
        }
        else {
            var options = { weekday: 'short' };
            strDate = this.triggerDate.toLocaleDateString(this.locale, options);
        }
        return strDate;
    };
    Reminder.prototype.userExists = function () {
        return (this.user != "none");
    };
    Reminder.prototype.init = function () {
        var _this = this;
        //bind dismiss btn
        $("#reminder-" + this.id).find(".btn-dismiss").on("click", function () { _this.onDismissClicked(); });
    };
    Reminder.prototype.onDismissClicked = function () {
        this.socket.emit("reminder", { task: "hide", id: this.id });
        $("#reminder-" + this.id).find(".btn-dismiss").addClass("hide");
        $("#reminder-" + this.id).find(".reminder-card").removeClass("triggered");
    };
    return Reminder;
})();
//# sourceMappingURL=reminder.js.map