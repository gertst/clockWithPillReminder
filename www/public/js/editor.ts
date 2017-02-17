///<reference path="../../node_modules/@types/jquery/index.d.ts"/>
/**
 * Created by Gert on 18/01/2017.
 */


class Editor {

    private _$body: JQuery;
    private _$tabContentPassed: JQuery;
    private _$tabContentUpcoming: JQuery;
    public reminders:Reminder[];
    public socket;

    constructor ($body: string) {
        this._$body = $body;
        this._$tabContentPassed = $("#fixed-tab-passed > .page-content");
        this._$tabContentUpcoming = $("#fixed-tab-upcoming > .page-content");
        this.reminders = [];

        this.getReminderData("reminders.json");

        //init socket
        this.socket = io();

        this.socket.on('reminder', (data) => function(data){
            if (data.task == "hide") {
                document.reload();
                //alert('hide id' + data.id);
               // $reminders.find(".reminder[data-id='" + data.id + "']").remove();
            }
        });

        this.socket.on('reload', function(msg){
            window.location.reload();
        });

    }

    private getReminderData(jsonFn:String):void {
        $.ajax(jsonFn + "?" + Math.random(), {dataType:"json"})
            .done((json) => this.onJsonLoaded(json));

    }

    private onJsonLoaded(remindersArray:array):void {
        let passedHtml:string = "";
        let upcomingHtml:string = "";
        let lastDate:Date = new Date("1970/1/1");
        for (let reminderJson of remindersArray) {
            let reminder:Reminder = new Reminder(this.socket, reminderJson)
            this.reminders.push(reminder);
            if (!reminder.isPassed) {
                if (lastDate.getTime() > reminder.triggerDate.getTime()) {
                    upcomingHtml = reminder.toHtml() + upcomingHtml;
                } else {
                    upcomingHtml = upcomingHtml + reminder.toHtml();
                }
                lastDate = reminder.triggerDate;
            } else {
                passedHtml += reminder.toHtml();
            }

        }
        this._$tabContentUpcoming.html(upcomingHtml);
        this._$tabContentPassed.html(passedHtml);
    }
}