/**
 * Created by Gert on 21/01/2017.
 */
 enum Frequency {
    Once,
    EachMinute,
    Hourly,
    Daily,
    Weekly,
    Monthly,
    Yearly
}

class Reminder {
    public id:string;
    public user:string;
    public label:string;
    public color:string;
    public triggerDate:Date;
    public frequency:Frequency;
    public done:boolean;

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

    constructor (reminderJson:json) {
        this.id = reminderJson.id;
        this.user = reminderJson.user;
        this.label = reminderJson.label;
        this.color = reminderJson.color;
        this.triggerDate = new Date(reminderJson.triggerDate);
        this.frequency = reminderJson.frequency;
        this.done = (reminderJson.done == 'true');
    }

    public get isActive():bool {
        return  (this.triggerDate.getTime() > new Date().getTime() && this.done != "true");
    }

    public toHtml():string {
        let template = $('#templateReminder').html();
        Mustache.parse(template);   // optional, speeds up future uses
        return Mustache.render(template, this);

    }
}