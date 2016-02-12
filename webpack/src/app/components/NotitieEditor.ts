import {Component} from 'angular2/core';
import {NotitieService} from '../services/NotitieService';
import {Notitie} from '../services/NotitieService';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Input} from 'angular2/core';
import {RootActionCreator} from '../store/actions/root.actions';
import {Store} from '../store/Store';
import {ChangeDetectionStrategy} from 'angular2/core';
import {SimpleChange} from 'angular2/core';

@Component({
    selector: 'notitie-editor',
    template: `
        <form style="padding:4px">
            <div style="color:red;padding:4px 0">{{notitie|json}} / {{temp.tekst}}</div>
            <input type="text" #notitieveld [(ngModel)]="temp.tekst">
            <br/>
            <button (click)="opslaan(notitieveld.value)">Opslaan</button>
        </form>
    `,
    directives: [FORM_DIRECTIVES],
    changeDetection: ChangeDetectionStrategy.CheckAlways
})
export class NotitieEditor {

    @Input() notitie;
    @Input() notities;

    temp: Notitie = new Notitie('');

    constructor(private store: Store, public rootActionCreator: RootActionCreator) {}

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        console.log('changes ', changes);
        if (changes['notitie'].currentValue) {
            this.temp.tekst = changes['notitie'].currentValue.tekst;
        }
    }

    opslaan(notitieTextarea: string) {
        this.store.dispatch(this.rootActionCreator.addNotitie(notitieTextarea));
    }

}
