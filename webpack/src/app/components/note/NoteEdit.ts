import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Notitie} from '../../services/NotitieService';
import {Store} from '../../store/Store';
import {RootActionCreator} from '../../store/actions/root.actions';
import {RouteParams} from 'angular2/router';
import {Router} from 'angular2/router';

@Component({
    selector: 'note-edit',
    template: `
        <form style="padding:4px">
            <input type="text" #noteField [ngModel]="note.tekst">
            <br/>
            <button type="button" (click)="saveNote(noteField.value)">Save</button>
        </form>
    `,
    directives: [FORM_DIRECTIVES]
})
export class NoteEdit {

    note: Notitie = new Notitie();

    constructor(private store: Store, public noteActions: RootActionCreator,
            public router: Router, routeParams: RouteParams) {
        store.subscribe(newState => {
            this.note = newState.root.get('notitieState').note;
        });
        if (routeParams.get('id')) {
            this.store.dispatch(this.noteActions.getNote(routeParams.get('id')));
        }
    }

    saveNote(noteField: string) {
        if (this.note.id) {
            this.store.dispatch(this.noteActions.updateNote(this.note.id, noteField));
        } else {
            this.store.dispatch(this.noteActions.createNote(noteField));
        }
        this.router.navigate(['Notes']);
    }

}
