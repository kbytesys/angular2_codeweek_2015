// Typescript
import {Component, Inject, Injectable, View, bootstrap, ElementRef, NgFor, EventEmitter, Pipe} from 'angular2/angular2';
import {Http, HTTP_BINDINGS} from 'angular2/http';

@Pipe({
    name: 'matchResultString'
})
class MatchResultStringPipe {
    transform(value: JSON, args:any[]) {
        if(value['status'] == 'notstarted') {
            return 'x - x';
        }
        else {
            return value['scorea'] + ' - ' + value['scoreb'];
        }
    }

    return;
}

@Injectable()
class LivescoreService {
    http: Http;
    dategroup_data: Array<JSON>;
    polling_id: number;
    last_update_str: string;

    updated = new EventEmitter();

    constructor(http: Http) {
        this.http = http;
    }

    startPolling(url: string, interval: number) {
        this.fetchData(this.http, url);
        this.polling_id = setInterval(
            () => { this.fetchData(this.http, url) }, interval
        );
    }

    fetchData(http: Http, url: string): void {
        var request = http.get(url)
            .toRx()
            .map(res => res.json());
        // Attenzione all'ordine delle chiamate!
        request.subscribeOnError(error => alert(error))
        request.subscribeOnNext(data => this.elaborateJson(data))
        request.subscribeOnCompleted(() => console.debug(this.last_update_str))
    }

    stopFetch(): void {
        clearInterval(this.polling_id);
    }

    elaborateJson(json_data): void {
        if (json_data.lastupdate != this.last_update_str) {
            this.last_update_str = json_data.lastupdate
            this.dategroup_data = json_data.dategroups;
            this.updated.next(this.dategroup_data);
        }
    }

    getUpdatedEmitter() {
        return this.updated.toRx();
    }

    searchMatch(searchString: string): Array<JSON> {
        return null;
    }
}

@Component({
    selector: 'livescore-summary',
})
@View({
    directives: [
        NgFor,
    ],
    // TSC Error BUG https://github.com/angular/angular/issues/4279
    pipes: [MatchResultStringPipe],
    templateUrl: 'demo2-template.html',
})
class LivescoreSummaryComponent {

    dategroup_data: Array<JSON>;
    livescoreService: LivescoreService;

    constructor(livescoreService: LivescoreService) {
        this.livescoreService = livescoreService;
        this.livescoreService.getUpdatedEmitter()
            .subscribe((data) => this.dategroup_data=data);
    }
}

@Component({
    selector: 'livescore-search',
    properties: ['name']
})
@View({
    template: '<h1>Suino: Miao</h1>'
})
class LivescoreSearchComponent {
    constructor(livescoreService: LivescoreService) {
        //this.name = livescoreService.getName()
    }
}

@Component({
    selector: 'demo3'
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
class DemoApp3Compnent {
    // https://github.com/angular/angular/issues/1858
    // constructor(http: Http, @Attribute('url') url: string) {
    constructor(livescoreService: LivescoreService, public elementRef: ElementRef) {
        // https://github.com/angular/angular/issues/1858
        // this.url = url;
        var native = elementRef.nativeElement;
        livescoreService.startPolling(native.getAttribute('url'), 10000);
    }
}

bootstrap(
    DemoApp3Compnent,
    [
        HTTP_BINDINGS,
        LivescoreService
    ]
);