///<reference path="../../node_modules/@types/jquery/index.d.ts"/>
/**
 * Created by Gert on 18/01/2017.
 */


class Editor {

    private _$body: JQuery;
    private _$tabContentPassed: JQuery;
    private _$tabContentUpcoming: JQuery;
    public reminders:Reminder[];

    constructor ($body: string) {
        this._$body = $body;
        this._$tabContentPassed = $("#fixed-tab-passed");
        this._$tabContentUpcoming = $("#fixed-tab-upcoming");
        this.reminders = [];

        this.getReminderData("reminders.json");

    }

    private getReminderData(jsonFn:String):void {
        $.ajax(jsonFn + "?" + Math.random(), {dataType:"json"})
            .done((json) => this.onJsonLoaded(json));

    }

    private onJsonLoaded(remindersArray:array):void {
        let passedHtml:string = "";
        let upcomingHtml:string = "";
        for (let reminderJson of remindersArray) {
            let reminder:Reminder = new Reminder(reminderJson)
            this.reminders.push(reminder);
            if (reminder.isActive) {
                upcomingHtml += reminder.toHtml();
            } else {
                passedHtml += reminder.toHtml();
            }

        }
        this._$tabContentUpcoming.html(upcomingHtml);
        this._$tabContentPassed.html(passedHtml);
    }
}