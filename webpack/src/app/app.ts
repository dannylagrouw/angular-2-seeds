import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {RootComponent} from './components/root/root.component';
import {NoteEdit} from './components/note/NoteEdit';
import {NoteList} from './components/note/NoteList';

@Component({
    selector: 'app',
    styles: [require('./app.scss')],
    encapsulation: ViewEncapsulation.None,
    template: require('./app.html'),
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/', name: 'Home', component: RootComponent },
    { path: '/notes', name: 'Notes', component: NoteList },
    { path: '/note/:id', name: 'Note', component: NoteEdit },
    { path: '/note', name: 'Note', component: NoteEdit }
])
export class App { }
