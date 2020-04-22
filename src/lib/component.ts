import Store from '../store/store.js';
import {PubSubEvents} from './pubsub.js';

export default class Component {

    element: any;

    constructor(params: {store: Store, element?}) {
        let ctx = this;

        //ctx.render = ctx.render || function() {}; //lets componenet override

        params.store.events.subscribe(PubSubEvents.STATECHANGE,() => ctx.render()); //re-render whenever there is a state change

        ctx.element = params.element;

    }

    render(): void {}
}