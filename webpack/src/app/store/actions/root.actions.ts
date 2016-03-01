import {Injectable} from 'angular2/core';
import {Notitie} from '../../services/NotitieService';
import {Http} from 'angular2/http';

export enum RootActionType {
    START_LOADING,
    FINISH_LOADING,
    SET_NOTES,
    SET_NOTE,
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

    getNotes() {
        return dispatch => {
            dispatch(this.startSlowOperation());

            return this.http.get('/note')
                .subscribe(response => {
                    dispatch(this.finishSlowOperation());
                    if (response.ok) {
                        dispatch(this.setNotes(response.json()['notes']));
                    } else {
                        console.log('getNotes not ok', response);
                    }
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
        return dispatch => {
            dispatch(this.startSlowOperation());

            return this.http.get('/note/' + id)
                .subscribe(response => {
                    dispatch(this.finishSlowOperation());
                    if (response.ok) {
                        dispatch(this.setNote(response.json()['note']));
                    } else {
                        console.log('getNote not ok', response);
                    }
                });
        };
    }

    setNote(note: Notitie) {
        return {
            type: RootActionType.SET_NOTE,
            note: note
        };
    }

    createNote(text: string) {
        return dispatch => {
            dispatch(this.startSlowOperation());

            return this.http.post('/note', JSON.stringify({text: text}))
                .subscribe(response => {
                    dispatch(this.finishSlowOperation());
                    if (response.ok) {
                        dispatch(this.setNote(response.json()['note']));
                    } else {
                        console.log('createNote not ok', response);
                    }
                });
        };
    }

    updateNote(id: string, text: string) {
        return dispatch => {
            dispatch(this.startSlowOperation());

            return this.http.put('/note/' + id, JSON.stringify({text: text}))
                .subscribe(response => {
                    dispatch(this.finishSlowOperation());
                    if (response.ok) {
                        // toast
                    } else {
                        console.log('updateNote not ok', response);
                    }
                });
        };
    }

    deleteNote(id: string) {
        return dispatch => {
            dispatch(this.startSlowOperation());

            return this.http.delete('/note/' + id)
                .subscribe(response => {
                    dispatch(this.finishSlowOperation());
                    if (response.ok) {
                        // toast
                    } else {
                        console.log('deleteNote not ok', response);
                    }
                });
        };
    }

}
