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
                .map(res => res.json());

        request.subscribe(
                data => this.elaborateJson(data),
                error => alert("Errore ajax " + error),
                () => console.debug(this.last_update_str)
        );
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

    searchMatch(searchString: string): JSON {
        var search = searchString.toLowerCase();
        for(var i in this.dategroup_data) {
            var g = this.dategroup_data[i];
            for(var j in g['matches']) {
                var match = g['matches'][j];
                if(match.teama_name.toLowerCase() == search ||
                   match.teamb_name.toLowerCase() == search) {
                    return match;
                }
            }
        }

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
})
@View({
    template: `
    <h3>La tua squadra vince?</h3>
    <input type="text" #search_text placeholder="Nome Squadra" (keyup.enter)="search(search_text.value)">
    <button type="button" class="btn btn-default" (click)="search(search_text.value)">Cerca</button>
    <p class="demo3-risultato">{{ message }}</p>
    `
})
class LivescoreSearchComponent {
    livescoreService: LivescoreService;
    message: string;
    constructor(livescoreService: LivescoreService) {
        this.livescoreService = livescoreService;
    }

    search(search_text) {
        var match = this.livescoreService.searchMatch(search_text);
        if(match) {
            if(match['status'] != 'live') {
                this.message = "Partita non iniziata.";
            }
            else if(match['scorea'] == match['scoreb']) {
                this.message = "La tua squadra sta pareggiando."
            } else {
                var is_teama = match['teama_name'].toLowerCase() == search_text.toLowerCase();
                var scorea_major = match['scorea'] > match['scoreb'];
                var winner = is_teama && scorea_major || (!is_teama && !scorea_major)
                if(winner) {
                    this.message = "La tua squadra sta vincendo! YEEEEEE!"
                }
                else {
                    this.message = "La tua squadra sta perdendo! BUUUUU!"
                }
            }
        }
        else {
            this.message = "La squadra inserita non è stata trovata";
        }
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
        ElementRef,
        HTTP_BINDINGS,
        LivescoreService
    ]
);