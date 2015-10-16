import {Component, View, Attribute, bootstrap, ElementRef, Injector, Inject, NgFor, bind} from 'angular2/angular2';
import {XHRBackend, BaseRequestOptions, Http, HTTP_BINDINGS} from 'angular2/http';

@Component({
    selector: 'livescore-match',
    properties: ['data']
})
@View({
    template: `
    <div class="row centered-text no-content">
        <div class="col-xs-4">{{ teama }}</div>
        <div class="col-xs-4">{{ scorea }} - {{ scoreb }}</div>
        <div class="col-xs-4">{{ teamb }}</div>
    </div>
    `

})
class LivescoreMatch {
    teama: string;
    teamb: string;
    scorea: string;
    scoreb: string;
    data: Object;


    onInit() {
        if(this.data['status'] == 'notstarted') {
            this.scorea = this.scoreb = 'x'
        }
        else {
            this.scorea = this.data['scorea'];
            this.scoreb = this.data['scoreb'];
        }

        this.teama = this.data['teama_name'];
        this.teamb = this.data['teamb_name'];
    }
}

@Component({
    selector: 'livescore-daygroup',
    properties: ['data']
})
@View({
    template: `
    <div class="row livegroup">
        <div class="row centered-text">
            <div class="col-xs-12">
                <h4 class="livedate">{{ date }}</h4>
            </div>
            <div class="col-xs-4"><b>Squadra A</b></div>
            <div class="col-xs-4"><b>Risultato</b></div>
            <div class="col-xs-4"><b>Squadra B</b></div>
        </div>
        <hr>
        <livescore-match class="no-content" *ng-for="#m of matches_data" [data]="m">
        </livescore-match>
    </div>
    `,
    directives: [NgFor, LivescoreMatch]
})
class DayGroupComponent {
    date: string;
    matches_data: JSON;
    data: JSON;

    onInit() {
        this.date = this.data['group_date'];
        this.matches_data = this.data['matches'];
    }
}

@Component({
    selector: 'demo1',
    viewBindings: [
        HTTP_BINDINGS
    ]
})
@View({
    template: `
    <div class="row">
        <div class="col-md-6 col-md-offset-3 col-xs-12">
            <livescore-daygroup *ng-for="#g of dategroup_data" [data]="g">
            <!-- A differenza di Polymer, non possiamo innestare i children
            <livescore-match *ng-for="#m of g.matches" [data]="m"></livescore-match> -->
            </livescore-daygroup>
        </div>
    </div>`,
    directives: [
        DayGroupComponent,
        NgFor
    ]
})
export class AppComponent {
    url: string;
    dategroup_data: Array<JSON>;
    polling_id: number;
    last_update_str: string;

    // https://github.com/angular/angular/issues/1858
    // constructor(http: Http, @Attribute('url') url: string) {
    constructor(http: Http, @Inject(ElementRef) elementRef: ElementRef) {
        // https://github.com/angular/angular/issues/1858
        // this.url = url;
        var native = elementRef.nativeElement;
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

bootstrap(AppComponent);