import {Component, View, Attribute, bootstrap, ElementRef, Injector, NgFor, Inject, Pipe, bind} from 'angular2/angular2';
import {XHRBackend, BaseRequestOptions, Http, HTTP_BINDINGS} from 'angular2/http';

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
}

@Component({
    selector: 'demo2',
    viewBindings: [
        HTTP_BINDINGS
    ]
})
@View({
    directives: [
        NgFor,
    ],
    // TSC Error BUG https://github.com/angular/angular/issues/4279
    pipes: [MatchResultStringPipe],
    templateUrl: 'demo2-template.html',
})
export class AppComponent {
    url: string;
    dategroup_data: Array<JSON>;
    polling_id: number;
    last_update_str: string;

    // https://github.com/angular/angular/issues/1858
    // constructor(http: Http, @Attribute('url') url: string) {
    constructor(http: Http, public elementRef: ElementRef) {
        // https://github.com/angular/angular/issues/1858
        // this.url = url;
        var native = this.elementRef.nativeElement;
        this.url = native.getAttribute('url');

        this.fetchData(http);
        this.polling_id = setInterval(() => { this.fetchData(http) }, 10000);
    }

    fetchData(http: Http): void {
        var request = http.get(this.url)
            .map(res => res.json());

        request.subscribe(
                data => this.elaborateJson(data),
                error => alert(error),
                () => console.debug(JSON.stringify(this.last_update_str)));
    }

    stopFetch(): void {
        clearInterval(this.polling_id);
    }

    elaborateJson(json_data): void {
        if (json_data.lastupdate != this.last_update_str) {
            this.last_update_str = json_data.lastupdate
            this.dategroup_data = json_data.dategroups;
        }
    }
}

bootstrap(AppComponent,
    [
        ElementRef
    ]
);