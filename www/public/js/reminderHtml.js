/**
 * Created by Gert on 22/01/2017.
 */
var ReminderHtml = (function () {
    function ReminderHtml(reminder) {
        var template = $('#template').html();
        Mustache.parse(template); // optional, speeds up future uses
        var rendered = Mustache.render(template, { name: "Luke" });
        $('#target').html(rendered);
    }
    return ReminderHtml;
})();
//# sourceMappingURL=reminderHtml.js.map