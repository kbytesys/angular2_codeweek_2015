var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// Typescript
var angular2_1 = require('angular2/angular2');
var http_1 = require('angular2/http');
var router_1 = require('angular2/router');
var MatchResultStringPipe = (function () {
    function MatchResultStringPipe() {
    }
    MatchResultStringPipe.prototype.transform = function (value, args) {
        if (value['status'] == 'notstarted') {
            return 'x - x';
        }
        else {
            return value['scorea'] + ' - ' + value['scoreb'];
        }
    };
    MatchResultStringPipe = __decorate([
        angular2_1.Pipe({
            name: 'matchResultString'
        }), 
        __metadata('design:paramtypes', [])
    ], MatchResultStringPipe);
    return MatchResultStringPipe;
})();
var LivescoreService = (function () {
    function LivescoreService(http) {
        this.updated = new angular2_1.EventEmitter();
        this.http = http;
    }
    LivescoreService.prototype.startPolling = function (url, interval) {
        var _this = this;
        this.fetchData(this.http, url);
        this.polling_id = setInterval(function () { _this.fetchData(_this.http, url); }, interval);
    };
    LivescoreService.prototype.fetchData = function (http, url) {
        var _this = this;
        var request = http.get(url)
            .map(function (res) { return res.json(); });
        request.subscribe(function (data) { return _this.elaborateJson(data); }, function (error) { return alert("Errore ajax " + error); }, function () { return console.debug(_this.last_update_str); });
    };
    LivescoreService.prototype.stopFetch = function () {
        clearInterval(this.polling_id);
    };
    LivescoreService.prototype.elaborateJson = function (json_data) {
        if (json_data.lastupdate != this.last_update_str) {
            this.last_update_str = json_data.lastupdate;
            this.dategroup_data = json_data.dategroups;
            this.updated.next(this.dategroup_data);
        }
    };
    LivescoreService.prototype.getUpdatedEmitter = function () {
        return this.updated.toRx();
    };
    LivescoreService.prototype.searchMatch = function (searchString) {
        var search = searchString.toLowerCase();
        for (var i in this.dategroup_data) {
            var g = this.dategroup_data[i];
            for (var j in g['matches']) {
                var match = g['matches'][j];
                if (match.teama_name.toLowerCase() == search ||
                    match.teamb_name.toLowerCase() == search) {
                    return match;
                }
            }
        }
        return null;
    };
    LivescoreService.prototype.getJSONData = function () {
        return this.dategroup_data;
    };
    LivescoreService = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], LivescoreService);
    return LivescoreService;
})();
var LivescoreSummaryComponent = (function () {
    function LivescoreSummaryComponent(livescoreService) {
        var _this = this;
        this.livescoreService = livescoreService;
        this.livescoreService.getUpdatedEmitter()
            .subscribe(function (data) { return _this.dategroup_data = data; });
        // Il costruttore scatta al cambio di route!!!
        this.dategroup_data = this.livescoreService.getJSONData();
    }
    LivescoreSummaryComponent = __decorate([
        angular2_1.Component({
            selector: 'livescore-summary',
        }),
        angular2_1.View({
            directives: [
                angular2_1.NgFor,
            ],
            // TSC Error BUG https://github.com/angular/angular/issues/4279
            pipes: [MatchResultStringPipe],
            templateUrl: 'demo2-template.html',
        }), 
        __metadata('design:paramtypes', [LivescoreService])
    ], LivescoreSummaryComponent);
    return LivescoreSummaryComponent;
})();
var LivescoreSearchComponent = (function () {
    function LivescoreSearchComponent(livescoreService) {
        this.livescoreService = livescoreService;
    }
    LivescoreSearchComponent.prototype.search = function (search_text) {
        var match = this.livescoreService.searchMatch(search_text);
        if (match) {
            if (match['status'] != 'live') {
                this.message = "Partita non iniziata.";
            }
            else if (match['scorea'] == match['scoreb']) {
                this.message = "La tua squadra sta pareggiando.";
            }
            else {
                var is_teama = match['teama_name'].toLowerCase() == search_text.toLowerCase();
                var scorea_major = match['scorea'] > match['scoreb'];
                var winner = is_teama && scorea_major || (!is_teama && !scorea_major);
                if (winner) {
                    this.message = "La tua squadra sta vincendo! YEEEEEE!";
                }
                else {
                    this.message = "La tua squadra sta perdendo! BUUUUU!";
                }
            }
        }
        else {
            this.message = "La squadra inserita non è stata trovata";
        }
    };
    LivescoreSearchComponent = __decorate([
        angular2_1.Component({
            selector: 'livescore-search',
        }),
        angular2_1.View({
            template: "\n    <h3>La tua squadra vince?</h3>\n    <input type=\"text\" #search_text placeholder=\"Nome Squadra\" (keyup.enter)=\"search(search_text.value)\">\n    <button type=\"button\" class=\"btn btn-default\" (click)=\"search(search_text.value)\">Cerca</button>\n    <p class=\"demo3-risultato\">{{ message }}</p>\n    "
        }), 
        __metadata('design:paramtypes', [LivescoreService])
    ], LivescoreSearchComponent);
    return LivescoreSearchComponent;
})();
var DemoApp4Compnent = (function () {
    function DemoApp4Compnent(livescoreService, elementRef) {
        var native = elementRef.nativeElement;
        // Troppo pigro per una funzione decente
        this.url = location.pathname.replace('demo4.html', native.getAttribute('url'));
        livescoreService.startPolling(this.url, 10000);
    }
    DemoApp4Compnent = __decorate([
        angular2_1.Component({
            selector: 'demo4'
        }),
        angular2_1.View({
            templateUrl: 'demo4-template.html',
            directives: [
                router_1.ROUTER_DIRECTIVES
            ]
        }),
        router_1.RouteConfig([
            { path: '/', component: LivescoreSearchComponent, as: 'Home' },
            { path: '/summary', component: LivescoreSummaryComponent, as: 'Risultati' }
        ]),
        __param(1, angular2_1.Inject(angular2_1.ElementRef)), 
        __metadata('design:paramtypes', [LivescoreService, angular2_1.ElementRef])
    ], DemoApp4Compnent);
    return DemoApp4Compnent;
})();
angular2_1.bootstrap(DemoApp4Compnent, [
    router_1.ROUTER_BINDINGS,
    angular2_1.bind(router_1.APP_BASE_HREF).toValue(location.pathname),
    http_1.HTTP_BINDINGS,
    LivescoreService
]);
//# sourceMappingURL=demo4.js.map