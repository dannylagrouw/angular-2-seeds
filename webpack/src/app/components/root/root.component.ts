import {Component} from 'angular2/core';
import {Store} from '../../store/Store';
import {RootActionCreator} from '../../store/actions/root.actions';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'root',
    styles: [require('./root.scss')],
    template: require('./root.html'),
    directives: [ROUTER_DIRECTIVES]
})
export class RootComponent {
    state = {};

    constructor(private store: Store, private actionCreator: RootActionCreator) {
        store.subscribe(newState => {
            this.state = newState.root.toJS()['notitieState'];
            console.debug('state', this.state);
        });
        this.state = this.store.getState();
    }

}
