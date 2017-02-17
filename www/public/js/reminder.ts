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
    private locale:string = "nl-BE";
    private socket;

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

    constructor (socket, reminderJson:json) {
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
                setTimeout(() => {
                    this.createReminder();
                }, 1000);
            } else {
                if (this.triggerDate.getTime() > new Date().getTime()) {
                    //plan event
                    let delay:number = this.triggerDate.getTime() - new Date().getTime();
                    setTimeout(() => {
                        this.createReminder();
                    }, delay);
                }
            }

        }

    }

    public createReminder():void {
        $("#reminder-" + this.id).find(".btn-dismiss").removeClass("hide");
        $("#reminder-" + this.id).find(".reminder-card").addClass("triggered");
    }

    public get isPassed():bool {
        return  (this.triggerDate.getTime() < new Date().getTime() && this.done);
    }

    public toHtml():string {
        let template = $('#templateReminder').html();
        Mustache.parse(template);   // optional, speeds up future uses
        setTimeout(() => {this.init()}, 100);
        return Mustache.render(template, this);
    }

    public userLower():string {
        return this.user.toLowerCase()
    }

    /**
     * eg: 17 May
     * @returns {string}
     */
    public formatDate():string {
        var options = { day: 'numeric', month: 'short' };
        return this.triggerDate.toLocaleDateString(this.locale, options);
    }

    /**
     * eg: 6PM
     * @returns {string}
     */
    public formatHour():string {
        var options = { date:"", hour: 'numeric', minute: "2-digit"};
        return this.triggerDate.toLocaleTimeString(this.locale, options);
    }

    public dateDay():string {
        return this.relativeDayFormat(this.triggerDate);
    }

    /*
     If the date is:
     Today - show as "Today";
     Tomorrow - show as "Tomorrow"
     Yesterday - show as "Yesterday"
     Else - show "Mon", "Tue", ...
     */

    private relativeDayFormat (date:Date):string {

        var strDate = "";

        var today = new Date();

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear() ) {
            strDate = "Today";
        } else if (yesterday.getDate() == date.getDate() && yesterday.getMonth() == date.getMonth() && yesterday.getFullYear() == date.getFullYear() ) {
            strDate = "Yesterday";
        } else if (tomorrow.getDate() == date.getDate() && tomorrow.getMonth() == date.getMonth() && tomorrow.getFullYear() == date.getFullYear() ) {
            strDate = "Tomorrow";
        } else {
            var options = { weekday: 'short'};
            strDate = this.triggerDate.toLocaleDateString(this.locale, options);
        }

        return strDate;
    }

    public userExists():boolean {
        return (this.user != "none");
    }


    public init():void {
        //bind dismiss btn
        $("#reminder-" + this.id).find(".btn-dismiss").on("click", () => {this.onDismissClicked()});

    }

    private onDismissClicked():void {
        this.socket.emit("reminder", {task: "hide", id: this.id});
        $("#reminder-" + this.id).find(".btn-dismiss").addClass("hide");
        $("#reminder-" + this.id).find(".reminder-card").removeClass("triggered");
    }
}