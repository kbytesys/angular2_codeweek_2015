// Typescript
import {Component, Inject, Injectable, View, bootstrap} from 'angular2/angular2';
import {Http, HTTP_BINDINGS} from 'angular2/http';

@Injectable()
class LivescoreService {
    name: string;
    http: Http;
    data: JSON;
    constructor(http: Http) {
        this.name = 'Pascal';
        this.http = http;
    }

    getName() {
        return this.name;
    }

    searchMatch(searchString: string) {

    }

    getJsonData() {

    }
}

@Component({
    selector: 'livescore-summary',
    properties: ['name']
})
@View({
    template: '<h1>{{ name }}</h1>'
})
class LivescoreSummaryComponent {
    name: string;
    constructor(livescoreService: LivescoreService) {
        this.name = livescoreService.getName()
    }
}

@Component({
    selector: 'livescore-search',
    properties: ['name']
})
@View({
    template: '<h1>Suino: {{ name }}</h1>'
})
class LivescoreSearchComponent {
    name: string;
    constructor(livescoreService: LivescoreService) {
        this.name = livescoreService.getName()
    }
}

@Component({
    selector: 'demo2'
})
@View({
    template: `
    <div class="row">
        <div class="col-md-6">
            <livescore-summary></livescore-summary>
        </div>
        <div class="col-md-6">
            <livescore-search></livescore-search>
        </div>
    </div>
    `,
    directives: [
        LivescoreSummaryComponent,
        LivescoreSearchComponent
    ]
})
class DemoApp2Compnent {
}

bootstrap(
    DemoApp2Compnent,
    [
        HTTP_BINDINGS,
        LivescoreService
    ]
);