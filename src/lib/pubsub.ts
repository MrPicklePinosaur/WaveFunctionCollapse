
export enum PubSubEvents {
    STATECHANGE
}

export default class PubSub {

    events: Record<PubSubEvents,Array<(state: Object) => void>>;
    //events: Record<PubSubEvents,{(state: Object): void;}[]>;

    constructor() {
        //this.events[PubSubEvents.STATECHANGE] = [];
    }

    subscribe(event: PubSubEvents, callback: {(state: Object): void}) { //subscibe callback function to event
        let self = this;

        if (!(event in self.events)) { //if event is not tracked
            self.events[event] = [];
        }
        self.events[event].push(callback);
    }


    publish(event: PubSubEvents, state: Object) { //trigger event
        let self = this;

        self.events[event].forEach(function(callback) {
            callback(state);
        });
    }
}