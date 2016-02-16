import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {App} from './app/app';
import {Store} from './app/store/Store';
import {RootActionCreator} from './app/store/actions/root.actions';
import {NotitieService} from './app/services/NotitieService';
import {provide} from 'angular2/core';
import {XHRBackend} from 'angular2/http';
import {MyMockedBackend} from './app/services/mock/MyMockedBackend';

// include for production builds
// import {enableProdMode} from 'angular2/core';
// enableProdMode() 

document.addEventListener('DOMContentLoaded', main);

function main() {
    //TODO if (!prodMode)...
    return bootstrap(App,
        [HTTP_PROVIDERS, ROUTER_PROVIDERS, Store, RootActionCreator, NotitieService,
            provide(XHRBackend, {useClass: MyMockedBackend})])
        .catch(err => console.error(err));
}
