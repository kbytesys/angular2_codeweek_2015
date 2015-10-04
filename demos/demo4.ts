// Typescript
import {Component, Inject, Injectable, View, bootstrap, ElementRef, NgFor, EventEmitter, Pipe, bind} from 'angular2/angular2';
import {Http, HTTP_BINDINGS} from 'angular2/http';
import {RouteConfig, Route, Router, ROUTER_DIRECTIVES, ROUTER_BINDINGS, APP_BASE_HREF} from 'angular2/router';

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

    getJSONData() {
        return this.dategroup_data;
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

        // Il costruttore scatta al cambio di route!!!
        this.dategroup_data = this.livescoreService.getJSONData();
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
    selector: 'demo4'
})
@View({
    templateUrl: 'demo4-template.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})
@RouteConfig([
    {path: '/', component: LivescoreSearchComponent, as: 'Home'},
    {path: '/summary', component: LivescoreSummaryComponent, as: 'Risultati'}
])
class DemoApp4Compnent {
    url: string;
    constructor(livescoreService: LivescoreService, public elementRef: ElementRef) {
        var native = elementRef.nativeElement;
        // Troppo pigro per una funzione decente
        this.url = location.pathname.replace('demo4.html', native.getAttribute('url'));

        livescoreService.startPolling(this.url, 10000);
    }
}

bootstrap(
    DemoApp4Compnent,
    [
        ROUTER_BINDINGS,
        bind(APP_BASE_HREF).toValue(location.pathname),
        HTTP_BINDINGS,
        LivescoreService
    ]
);