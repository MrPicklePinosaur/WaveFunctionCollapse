import Store from "../store/store.js";
import {PubSubEvents} from "../lib/pubsub.js";

export default class Component {

    element: any;

    constructor(params: any = {}) {
        let self = this;
        
        if (params.store instanceof Store) { //subscribe to state change
            params.store.subscribe(PubSubEvents.STATECHANGE, () => self.render());
        }

        self.element = (params.element || null);
    }

    render(): void { } //refresh when state is changed
}