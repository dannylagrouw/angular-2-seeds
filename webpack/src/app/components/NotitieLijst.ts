import {Component} from 'angular2/core';
import {NotitieService} from '../services/NotitieService';
import {Notitie} from '../services/NotitieService';
import {NgFor} from 'angular2/common';
import {Input} from 'angular2/core';
import {Store} from '../store/Store';
import {RootActionCreator} from '../store/actions/root.actions';

@Component({
    selector: 'notitie-lijst',
    template: `
        <tr *ngFor="#notitie of notities">
            <td (click)="select(notitie)">
                <span>{{notitie.tekst}}</span>
                <button (click)="verwijderen(notitie)">X</button>
            </td>
        </tr>
        <tr><td><button (click)="nieuw()">Toevoegen</button></td></tr>
    `,
    styles: [`
        td {
            min-width: 200px;
            padding: 4px;
            border-bottom: 1px solid lightblue;
        }
        td:hover {
            background-color: lightblue;
            cursor: pointer;
        }
        td button {
            float: right;
        }
    `],
    directives: [NgFor]
})
export class NotitieLijst {

    @Input() notities;

    constructor(private store: Store, public rootActionCreator: RootActionCreator) {}

    select(notitie: Notitie) {
        this.store.dispatch(this.rootActionCreator.selectNotitie(notitie));
    }

    verwijderen(notitie: Notitie) {
        this.store.dispatch(this.rootActionCreator.deleteNotitie(notitie));
    }

    nieuw() {
        this.store.dispatch(this.rootActionCreator.newNotitie());
    }
}
