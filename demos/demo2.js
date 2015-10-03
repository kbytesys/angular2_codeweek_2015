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
var AppComponent = (function () {
    // https://github.com/angular/angular/issues/1858
    // constructor(http: Http, @Attribute('url') url: string) {
    function AppComponent(http, elementRef) {
        var _this = this;
        this.elementRef = elementRef;
        // https://github.com/angular/angular/issues/1858
        // this.url = url;
        var native = this.elementRef.nativeElement;
        this.url = native.getAttribute('url');
        this.fetchData(http);
        this.polling_id = setInterval(function () { _this.fetchData(http); }, 10000);
    }
    AppComponent.prototype.fetchData = function (http) {
        var _this = this;
        var request = http.get(this.url)
            .toRx()
            .map(function (res) { return res.json(); });
        // Attenzione all'ordine delle chiamate!
        request.subscribeOnError(function (error) { return alert(error); });
        request.subscribeOnNext(function (data) { return _this.elaborateJson(data); });
        request.subscribeOnCompleted(function () { return console.debug(JSON.stringify(_this.json_data)); });
    };
    AppComponent.prototype.stopFetch = function () {
        clearInterval(this.polling_id);
    };
    AppComponent.prototype.elaborateJson = function (json_data) {
        if (json_data.lastupdate != this.last_update_str) {
            this.last_update_str = json_data.lastupdate;
            this.json_data = json_data;
            this.dategroup_data = json_data.dategroups;
        }
    };
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'demo2',
            viewBindings: [
                http_1.HTTP_BINDINGS
            ]
        }),
        angular2_1.View({
            directives: [
                angular2_1.NgFor,
            ],
            // Ignora l'errore fino alla prossima alpha di Angular2
            pipes: [MatchResultStringPipe],
            templateUrl: 'demo2-template.html',
        }), 
        __metadata('design:paramtypes', [http_1.Http, angular2_1.ElementRef])
    ], AppComponent);
    return AppComponent;
})();
exports.AppComponent = AppComponent;
angular2_1.bootstrap(AppComponent);
//# sourceMappingURL=demo2.js.map