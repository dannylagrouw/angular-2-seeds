import {Injectable} from 'angular2/core';
import {Notitie} from '../../services/NotitieService';

export const enum RootActionType {
    GET_NOTES,
    GET_NOTE,
    CREATE_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE
}

@Injectable()
export class RootActionCreator {
    constructor() {}

    getNotes() {
        return {
            type: RootActionType.GET_NOTES
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
