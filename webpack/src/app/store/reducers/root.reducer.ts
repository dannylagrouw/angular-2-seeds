import { Map } from 'immutable';
import {  } from '../actions/root.actions';
import {Notitie} from '../../services/NotitieService';
import {v4} from 'uuid';
import {RootActionType} from '../actions/root.actions';

export class NotitieState {
    loading: boolean;
    editing: Notitie = new Notitie();
    selected: Notitie;
    notes: Notitie[] = [];
    note: Notitie;
}

var initialState = Map({
    notitieState: new NotitieState()
});

var inMemNotes = [
    new Notitie('Notitie 1', v4()),
    new Notitie('Notitie 2', v4()),
    new Notitie('Notitie 3', v4()),
    new Notitie('Notitie 4', v4()),
    new Notitie('Notitie 5', v4()),
    new Notitie('Notitie 6', v4()),
    new Notitie('Notitie 7', v4()),
    new Notitie('Notitie 8', v4()),
    new Notitie('Notitie 9', v4())
];

export function rootReducer(state = initialState, action) {
    //var notitieState = _.clone(state.get('notitieState'));
    var notitieState = state.get('notitieState');
    switch (action.type) {
        case RootActionType.START_LOADING:
            notitieState.loading = true;
            break;
        case RootActionType.FINISH_LOADING:
            notitieState.loading = false;
            break;
        case RootActionType.SET_NOTES:
            notitieState.notes = _.clone(action.notes);
            break;
        case RootActionType.SET_NOTE:
            notitieState.note = _.clone(action.note);
            break;
        case RootActionType.CREATE_NOTE:
            var note = new Notitie(action.text);
            note.id = v4();
            inMemNotes.push(note);
            break;
        case RootActionType.UPDATE_NOTE:
            var selected = inMemNotes.find(n =>
                n.id === action.id);
            if (selected) {
                selected.tekst = action.text;
            }
            break;
        case RootActionType.DELETE_NOTE:
            var index = inMemNotes.findIndex(n =>
                n.id === action.id);
            if (index > -1) {
                inMemNotes.splice(index, 1);
            }
            break;
    }
    return state.set('notitieState', notitieState);
}
