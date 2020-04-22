import PubSub, {PubSubEvents} from "../lib/pubsub";


export default class Store {

    pubsub: PubSub;
    state: Object;

    constructor() {
        let self = this;

        self.pubsub = new PubSub();
        self.state = new Proxy({}, {
            set: function(target, key, value): boolean {
                
                target[key] = value;

                //NOTE: we do not want to be setting state manually, so possibly add a protection against that
                self.pubsub.publish(PubSubEvents.STATECHANGE,self.state);

                return true;
            }
        });
    }
}