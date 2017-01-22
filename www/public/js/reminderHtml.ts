/**
 * Created by Gert on 22/01/2017.
 */

class ReminderHtml {

    constructor(reminder:Reminder) {
        var template = $('#template').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, {name: "Luke"});
        $('#target').html(rendered);
    }


}