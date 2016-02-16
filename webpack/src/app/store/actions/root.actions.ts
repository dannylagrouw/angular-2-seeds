import {Injectable} from 'angular2/core';
import {Notitie} from '../../services/NotitieService';
import {Http} from 'angular2/http';

export const enum RootActionType {
    START_LOADING,
    FINISH_LOADING,
    GET_NOTES,
    SET_NOTES,
    GET_NOTE,
    CREATE_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE
}

@Injectable()
export class RootActionCreator {

    constructor(private http: Http) {}

    startSlowOperation() {
        return {
            type: RootActionType.START_LOADING
        };
    }

    finishSlowOperation() {
        return {
            type: RootActionType.FINISH_LOADING
        };
    }

    getNotesA() {
        return {
            type: RootActionType.GET_NOTES
        };
    }

    getNotes() {
        return dispatch => {
            console.log('getNotesA start');
            dispatch(this.startSlowOperation());

            return this.http.get('notesdata.json')
                .subscribe(response => {
                    setTimeout(() => {
                        dispatch(this.finishSlowOperation());
                        if (response.ok) {
                            console.log('getNotesA ok', response.json());
                            dispatch(this.setNotes(response.json()['notes']));
                        } else {
                            console.log('getNotesA not ok', response);
                        }
                    }, 3000);
                });
        };
    }

    setNotes(notes: Notitie[]) {
        return {
            type: RootActionType.SET_NOTES,
            notes: notes
        };
    }

    getNote(id: string) {
        return {
            type: RootActionType.GET_NOTE,
            id: id
        };
    }

    createNote(text: string) {
        return {
            type: RootActionType.CREATE_NOTE,
            text: text
        };
    }

    updateNote(id: string, text: string) {
        return {
            type: RootActionType.UPDATE_NOTE,
            id: id,
            text: text
        };
    }

    deleteNote(id: string) {
        return {
            type: RootActionType.DELETE_NOTE,
            id: id
        };
    }

}
