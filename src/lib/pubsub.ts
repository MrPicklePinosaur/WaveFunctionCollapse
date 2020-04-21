//tutorial from https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/

export type CallbackFunction = (data: any) => any;

export enum PubSubEvents {
    STATECHANGE
}

export default class PubSub {
    events: Record<PubSubEvents,CallbackFunction[]>; //dict

    constructor() {
        //this.events = {};
    }

    subscribe(event: PubSubEvents, callback: CallbackFunction): number { //the listener requests a subscription to a certain event

        let ctx = this;
        if (!ctx.events.hasOwnProperty(event)) { //if event not yet created, create it
            ctx.events[event] = [];
        }

        //todo: investigate why we are returning the new lenght of the callback list
        return this.events[event].push(callback); //push new callback into events
    }

    
    publish(event: PubSubEvents, data: any = {}) { //trigger an event, and notify all subscribers

        let ctx = this;
        if (!ctx.events.hasOwnProperty(event)) { //if event does not exist, do nothing
            return [];
        }

        return ctx.events[event].map(callback => callback(data)); //evaluate all the events
    }
    
}