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
    function Reminder(reminderJson) {
        this.id = reminderJson.id;
        this.user = reminderJson.user;
        this.label = reminderJson.label;
        this.color = reminderJson.color;
        this.triggerDate = new Date(reminderJson.triggerDate);
        this.frequency = reminderJson.frequency;
        this.done = (reminderJson.done == 'true');
    }
    Object.defineProperty(Reminder.prototype, "isActive", {
        get: function () {
            return (this.triggerDate.getTime() > new Date().getTime() && this.done != "true");
        },
        enumerable: true,
        configurable: true
    });
    Reminder.prototype.toHtml = function () {
        var template = $('#templateReminder').html();
        Mustache.parse(template); // optional, speeds up future uses
        return Mustache.render(template, this);
    };
    return Reminder;
})();
//# sourceMappingURL=reminder.js.map