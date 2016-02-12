import {Component} from 'angular2/core';
import {Store} from '../../store/Store';
import {RootActionCreator} from '../../store/actions/root.actions';
import {NotitieLijst} from '../NotitieLijst';
import {NotitieEditor} from '../NotitieEditor';
import {Notitie} from '../../services/NotitieService';

@Component({
    selector: 'root',
    styles: [require('./root.scss')],
    template: require('./root.html'),
    directives: [NotitieEditor, NotitieLijst]
})
export class RootComponent {
    state = {};

    constructor(private store: Store, private actionCreator: RootActionCreator) {
        // I'm interested in state updates, so I subscribe to them
        store.subscribe(newState => {
            this.state = newState.root.toJS()['notitieState'];
            console.debug('state', this.state);
        });
        this.state = this.store.getState();
        //this.store.dispatch(this.actionCreator.addNotitie('bladiebla'));
        //this.store.dispatch({type: 'INIT'});
    }

    addNotitie(notitieTextarea: string) {
        this.store.dispatch(this.actionCreator.addNotitie(notitieTextarea));
    }

}
