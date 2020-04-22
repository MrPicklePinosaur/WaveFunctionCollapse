import Component from "../lib/component.js";
import {store} from "../store/index.js";

export default class ColorSelector extends Component {
    
    constructor() {
        super({
            store: store,
            element: document.getElementById('color-button')
        });

        this.element.
        
        
    }

    render() {
        let self = this;

        console.log('ColorSelector Refreshed');

        self.element.color = store.state.color;
    }
}