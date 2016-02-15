import {Injectable} from 'angular2/core';
import {Notitie} from '../../services/NotitieService';
import {Http} from 'angular2/http';

export const enum RootActionType {
    START_LOADING,
    FINISH_LOADING,
    GET_NOTES,
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
        return {
            type: RootActionType.GET_NOTES
        };
    }

    getNotesA() {
        return dispatch => {
            console.log('getNotesA start');
            dispatch(this.startSlowOperation());

            return this.http.get('js/notesdata.json')
                //.map(res => JSON.parse(res))
                .subscribe(data => {
                    dispatch(this.finishSlowOperation());
                    console.log('getNotesA', data);
                    //if (data.status !== 'OK') {
                    //} else {
                        //dispatch(this.updateHoofdscherm(data.resultaat));
                    //}
                });
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
