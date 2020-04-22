import PubSub, {PubSubEvents} from '../lib/pubsub.js';


export enum StoreStatus {
    RESTING,
    MUTATION,
    ACTION
}

export default class Store {

    actions: Record<string,(ctx: any, payload: any)=> any>; //ActionKey : function
    mutations: Record<string,(state: any, payload: any)=> any>;;
    state: any;
    status: StoreStatus;
    events: PubSub;

    constructor(params: {actions?, mutations?, state?}) {
        let ctx = this;

        ctx.actions = params.actions || {};
        ctx.mutations = params.mutations || {};
        //ctx.state = {};
        ctx.status = StoreStatus.RESTING; //what the store is currently doing
        ctx.events = new PubSub();

        //apply special modifiers based on params passed in
        /*
        if (params.hasOwnProperty('actions')) {
            ctx.actions = params.actions;
        }
        if (params.hasOwnProperty('mutations')) {
            ctx.mutations = params.mutations;
        }
        */

        ctx.state = new Proxy((params.state || {}), { //if params has a state setting, take that as the target
            set: function(state: any, key: any, value: any): boolean {
                state[key] = value;

                console.log(`StateChange: ${key} -> ${value}`);
                
                ctx.events.publish(PubSubEvents.STATECHANGE,ctx.state); //notify all listeners
            
                if (ctx.status != StoreStatus.MUTATION) { //discourage setting state manually
                    console.warn(`You should be using mutations to set ${key}`);
                }
                ctx.status = StoreStatus.RESTING;
                return true;

            }
        });
    }

    dispatch(actionKey, payload): boolean {

        let ctx = this;

        if (!ctx.actions.hasOwnProperty(actionKey)) {
            console.error(`Action ${actionKey} does not exist`);
            return false;
        }

        console.groupCollapsed(`Action: ${actionKey}`);
        ctx.status = StoreStatus.ACTION;
        ctx.actions[actionKey](ctx,payload);
        console.groupEnd();

        return true;
    }

    commit(mutationKey, payload): boolean { //modifies the state based on payload

        let ctx = this;

        if (!ctx.mutations.hasOwnProperty(mutationKey)) {
            console.error(`Mutation ${mutationKey} does not exist`);
            return false;
        }

        ctx.status = StoreStatus.MUTATION;
        let newState = ctx.mutations[mutationKey](ctx.state, payload); //do something with the state
        ctx.state = Object.assign(ctx.state,newState);

        return true;
    }


}