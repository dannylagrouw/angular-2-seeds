import {Injectable} from 'angular2/core';
import {Notitie} from '../../services/NotitieService';

@Injectable()
export class RootActionCreator {
    constructor() {}

    addNotitie(notitieText: string) {
        return {
            type: 'addNotitie',
            text: notitieText
        };
    }

    selectNotitie(notitie: Notitie) {
        return {
            type: 'selectNotitie',
            notitie: notitie
        };
    }

    deleteNotitie(notitie: Notitie) {
        return {
            type: 'deleteNotitie',
            notitie: notitie
        };
    }

    newNotitie() {
        return {
            type: 'newNotitie'
        };
    }
}
