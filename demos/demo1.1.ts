import {Component, View, Attribute, bootstrap, ElementRef, Injector, NgFor, Inject, bind} from 'angular2/angular2';
import {XHRBackend, BaseRequestOptions, Http, HTTP_BINDINGS} from 'angular2/http';

@Component({
    selector: 'livescore-match',
    properties: ['data']
})
@View({
    template: `
    <tr>
        <td>{{ teama }}</td>
        <td>{{ scorea }} - {{ scoreb }}</td>
        <td>{{ teamb }}</td>
    </tr>
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
    properties: ['data', 'matches']
})
@View({
    template: `
    <h4>{{ date }}</h4>
    <table id="demo1-table" class="table table-striped">
        <thead>
          <tr>
            <th>Squadra A</th>
            <th>Risultato</th>
            <th>Squadra B</th>
          </tr>
        </thead>
        <tbody>
            <!-- L'elemento livescore-match viene aggiunto! -->
            <livescore-match *ng-for="#m of matches_data" [data]="m">
            </livescore-match>
        </tbody>
    </table>
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
        <div class="col-md-6 col-lg-offset-3">
            <livescore-daygroup *ng-for="#g of dategroup_data" [data]="g">
            <!-- A differenza di Polymer, non possiamo innestare i children
            <livescore-match *ng-for="#m of g.matches" [data]="m"></livescore-match> -->
            </livescore-daygroup>
        </div>
    </div>`,
    directives: [
        DayGroupComponent,
        LivescoreMatch,
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
            .toRx()
            .map(res => res.json());
        // Attenzione all'ordine delle chiamate!
        request.subscribeOnError(error => alert(error))
        request.subscribeOnNext(data => this.elaborateJson(data))
        request.subscribeOnCompleted(() => console.debug(JSON.stringify(this.last_update_str)))
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