import {Response, ResponseOptions} from 'angular2/http';
import {MockBackend, MockConnection} from 'angular2/http/testing';
import {Notitie} from '../NotitieService';
import {v4} from 'uuid';
import {BaseResponseOptions} from 'angular2/http';

export class MyMockedBackend extends MockBackend {
    constructor() {
        super();
        this.connections.subscribe(c => this.handleMockedRequest(c));
    }

    inMemNotes = JSON.stringify({notes: [
        new Notitie('Notitie 1', v4()),
        new Notitie('Notitie 2', v4()),
        new Notitie('Notitie 3', v4()),
        new Notitie('Notitie 4', v4()),
        new Notitie('Notitie 5', v4()),
        new Notitie('Notitie 6', v4()),
        new Notitie('Notitie 7', v4()),
        new Notitie('Notitie 8', v4()),
        new Notitie('Notitie 9', v4())
    ]});

    getNotesResponse() {
        return this.inMemNotes;
    }

    handleMockedRequest(connection: MockConnection) {
        if (connection.request.url === 'notesdata.json') {
            var response = new Response(new BaseResponseOptions().merge({
                body: this.getNotesResponse()
            }));
            response.ok = true;
            connection.mockRespond(response);
        }
    }
}
