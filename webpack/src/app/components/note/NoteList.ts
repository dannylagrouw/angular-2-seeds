import {Component} from 'angular2/core';
import {Notitie} from '../../services/NotitieService';
import {NgFor} from 'angular2/common';
import {Store} from '../../store/Store';
import {RootActionCreator} from '../../store/actions/root.actions';
import {Router} from 'angular2/router';

@Component({
    selector: 'note-list',
    template: `
        <div class="notes">
            <div *ngFor="#note of notes; #index = index" class="note">
                <span (click)="select(note)">{{note.tekst}}</span>
                <button (click)="deleteNote(note, index)">X</button>
            </div>
            <button (click)="addNote()">Add Note</button>
        </div>
    `,
    styles: [`
        .note {
            padding: 4px;
            border-bottom: 1px solid lightblue;
        }
        .note:hover {
            background-color: lightblue;
            cursor: pointer;
        }
        button {
            float: right;
        }
    `],
    directives: [NgFor]
})
export class NoteList {

    notes: Notitie[];

    constructor(private store: Store, public rootActionCreator: RootActionCreator,
                private router: Router) {
        store.subscribe(newState => {
            this.notes = newState.root.get('notitieState').notes;
        });
        this.store.dispatch(this.rootActionCreator.getNotes());
    }

    select(note: Notitie) {
        this.router.navigate(['Note', {id: note.id}]);
    }

    deleteNote(note: Notitie, index: number) {
        this.notes.splice(index, 1);
        this.store.dispatch(this.rootActionCreator.deleteNote(note.id));
    }

    addNote() {
        this.router.navigate(['Note']);
    }
}
