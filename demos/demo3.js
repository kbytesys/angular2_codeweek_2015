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
// Typescript
var angular2_1 = require('angular2/angular2');
var http_1 = require('angular2/http');
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
            .toRx()
            .map(function (res) { return res.json(); });
        // Attenzione all'ordine delle chiamate!
        request.subscribeOnError(function (error) { return alert(error); });
        request.subscribeOnNext(function (data) { return _this.elaborateJson(data); });
        request.subscribeOnCompleted(function () { return console.debug(_this.last_update_str); });
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
        return null;
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
        //this.name = livescoreService.getName()
    }
    LivescoreSearchComponent = __decorate([
        angular2_1.Component({
            selector: 'livescore-search',
            properties: ['name']
        }),
        angular2_1.View({
            template: '<h1>Suino: Miao</h1>'
        }), 
        __metadata('design:paramtypes', [LivescoreService])
    ], LivescoreSearchComponent);
    return LivescoreSearchComponent;
})();
var DemoApp3Compnent = (function () {
    // https://github.com/angular/angular/issues/1858
    // constructor(http: Http, @Attribute('url') url: string) {
    function DemoApp3Compnent(livescoreService, elementRef) {
        this.elementRef = elementRef;
        // https://github.com/angular/angular/issues/1858
        // this.url = url;
        var native = elementRef.nativeElement;
        livescoreService.startPolling(native.getAttribute('url'), 10000);
    }
    DemoApp3Compnent = __decorate([
        angular2_1.Component({
            selector: 'demo3'
        }),
        angular2_1.View({
            template: "\n    <div class=\"row\">\n        <div class=\"col-md-6\">\n            <livescore-summary></livescore-summary>\n        </div>\n        <div class=\"col-md-6\">\n            <livescore-search></livescore-search>\n        </div>\n    </div>\n    ",
            directives: [
                LivescoreSummaryComponent,
                LivescoreSearchComponent
            ]
        }), 
        __metadata('design:paramtypes', [LivescoreService, angular2_1.ElementRef])
    ], DemoApp3Compnent);
    return DemoApp3Compnent;
})();
angular2_1.bootstrap(DemoApp3Compnent, [
    http_1.HTTP_BINDINGS,
    LivescoreService
]);
//# sourceMappingURL=demo3.js.map