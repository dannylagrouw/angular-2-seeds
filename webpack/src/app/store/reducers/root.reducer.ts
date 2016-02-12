import { Map } from 'immutable';
import {  } from '../actions/root.actions';
import {Notitie} from '../../services/NotitieService';

class NotitieState {
    editing: Notitie = new Notitie();
    selected: Notitie;
    notities: Notitie[] = [];
}

var initialState = Map({
    notitieState: new NotitieState()
});

export function rootReducer(state = initialState, action) {
    console.log(action);
    //var notitieState = _.clone(state.get('notitieState'));
    var notitieState = state.get('notitieState');
    switch (action.type) {
        case 'addNotitie':
            if (notitieState.selected) {
                var selected = notitieState.notities.find(n =>
                    n.tekst === notitieState.selected.tekst);
                selected.tekst = action.text;
                notitieState.selected = undefined;
            } else if (action.text !== '') {
                notitieState.notities.push(new Notitie(action.text));
            }
            notitieState.editing = new Notitie('nieuw!');
            return state.set('notitieState', notitieState);
        case 'selectNotitie':
            notitieState.selected = action.notitie;
            notitieState.editing = new Notitie(action.notitie.tekst);
            return state.set('notitieState', notitieState);
        case 'deleteNotitie':
            //TODO
            return state;
        case 'newNotitie':
            notitieState.selected = undefined;
            notitieState.editing = new Notitie('nieuw!');
            return state.set('notitieState', notitieState);
        default:
            console.debug('return state', state.toJS());
            return state;
    }
}
