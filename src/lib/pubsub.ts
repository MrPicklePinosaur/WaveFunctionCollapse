//tutorial from https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/

export type CallbackFunction = (data: any) => any;

export default class PubSub {
    events: {[event: string]: CallbackFunction[]};
    
    constructor() {
        this.events = {};
    }

    subscribe(event: string, callback: CallbackFunction): number {

        let ctx = this;
        if (!ctx.events.hasOwnProperty(event)) { //if event not yet created
            ctx.events[event] = [];
        }

        //todo: investigate why we are returning the new lenght of the callback list
        return this.events[event].push(callback); //push new callback into events
    }

    
    publish(event: string, data: any = {}) {

        let ctx = this;
        if (!ctx.events.hasOwnProperty(event)) { //if event does not exist, do nothing
            return [];
        }

        return ctx.events[event].map(callback => callback(data)); //evaluate all the events
    }
    
}