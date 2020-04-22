import PubSub, {PubSubEvents} from "../lib/pubsub.js";
import {actions} from "./actions.js";

export default class Store {

    pubsub: PubSub;
    actions: any;
    state: any;

    constructor(params: any = {}) {
        let self = this;

        self.pubsub = new PubSub();
        self.actions = (params.actions || {});
        self.state = new Proxy((params.state || {}), {
            set: function(target, key, value): boolean {
                
                target[key] = value;

                //NOTE: we do not want to be setting state manually, so possibly add a protection against that
                self.pubsub.publish(PubSubEvents.STATECHANGE,self.state);

                return true;
            }
        });
    }

    dispatch(actionName: string, payload: any) { //modifies the state of the store

        let self = this;

        if (!(actionName in self.actions)) { 
            console.warn(`${actionName} is not a defined action`);
            return;
        }

        let newState = self.actions[actionName](self.state,payload);
        self.state = Object.assign(self.state, newState);
    }
}