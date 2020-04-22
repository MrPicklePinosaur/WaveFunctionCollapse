import Component from '../lib/component.js';
import store from '../store/index.js';

export default class Canvas extends Component {

    constructor() {
        super({
            store: store,
            element: document.getElementById('main-canvas')
        });
    }

    render(): void {
        let ctx = this;
    }
}