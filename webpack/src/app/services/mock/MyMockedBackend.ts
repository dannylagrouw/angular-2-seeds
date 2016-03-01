import {Response, ResponseOptions} from 'angular2/http';
import {MockBackend, MockConnection} from 'angular2/http/testing';
import {Notitie} from '../NotitieService';
import {v4} from 'uuid';
import {BaseResponseOptions} from 'angular2/http';
import {RequestMethod} from 'angular2/http';

export class MyMockedBackend extends MockBackend {
    constructor() {
        super();
        this.connections.subscribe(c => this.handleMockedRequest(c));
    }

    inMemNotes = [
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

    handleMockedRequest(connection: MockConnection) {
        if (connection.request.url === '/note') {
            if (connection.request.method === RequestMethod.Get) {
                connection.mockRespond(this.makeResponse({notes: this.inMemNotes}));
            } else if (connection.request.method === RequestMethod.Post) {
                var text = JSON.parse(connection.request.text().toString())['text'];
                var note = new Notitie(text, v4());
                this.inMemNotes.push(note);
                connection.mockRespond(this.makeResponse({note: note}));
            }
        }
        if (connection.request.url.startsWith('/note/')) {
            var id = connection.request.url.substr(6);
            var note = this.inMemNotes.find(note => note.id === id);
            if (connection.request.method === RequestMethod.Get) {
                connection.mockRespond(this.makeResponse({note: note}));
            } else if (connection.request.method === RequestMethod.Put) {
                note.tekst = JSON.parse(connection.request.text().toString())['text'];
                connection.mockRespond(this.makeResponse(undefined));
            } else if (connection.request.method === RequestMethod.Delete) {
                this.inMemNotes = this.inMemNotes.filter(note => note.id !== id);
                connection.mockRespond(this.makeResponse(undefined));
            }
        }
    }

    private makeResponse(payload: any) {
        var response = new Response(new BaseResponseOptions().merge({
            body: JSON.stringify(payload)
        }));
        response.ok = true;
        return response;
    }

}
