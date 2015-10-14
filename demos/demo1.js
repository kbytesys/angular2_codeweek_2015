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
var LivescoreMatch = (function () {
    function LivescoreMatch() {
    }
    LivescoreMatch.prototype.onInit = function () {
        if (this.data['status'] == 'notstarted') {
            this.scorea = this.scoreb = 'x';
        }
        else {
            this.scorea = this.data['scorea'];
            this.scoreb = this.data['scoreb'];
        }
        this.teama = this.data['teama_name'];
        this.teamb = this.data['teamb_name'];
    };
    LivescoreMatch = __decorate([
        angular2_1.Component({
            selector: 'livescore-match',
            properties: ['data']
        }),
        angular2_1.View({
            template: "\n    <div class=\"row centered-text no-content\">\n        <div class=\"col-xs-4\">{{ teama }}</div>\n        <div class=\"col-xs-4\">{{ scorea }} - {{ scoreb }}</div>\n        <div class=\"col-xs-4\">{{ teamb }}</div>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], LivescoreMatch);
    return LivescoreMatch;
})();
var DayGroupComponent = (function () {
    function DayGroupComponent() {
    }
    DayGroupComponent.prototype.onInit = function () {
        this.date = this.data['group_date'];
        this.matches_data = this.data['matches'];
    };
    DayGroupComponent = __decorate([
        angular2_1.Component({
            selector: 'livescore-daygroup',
            properties: ['data']
        }),
        angular2_1.View({
            template: "\n    <div class=\"row livegroup\">\n        <div class=\"row centered-text\">\n            <div class=\"col-xs-12\">\n                <h4 class=\"livedate\">{{ date }}</h4>\n            </div>\n            <div class=\"col-xs-4\"><b>Squadra A</b></div>\n            <div class=\"col-xs-4\"><b>Risultato</b></div>\n            <div class=\"col-xs-4\"><b>Squadra B</b></div>\n        </div>\n        <hr>\n        <livescore-match class=\"no-content\" *ng-for=\"#m of matches_data\" [data]=\"m\">\n        </livescore-match>\n    </div>\n    ",
            directives: [angular2_1.NgFor, LivescoreMatch]
        }), 
        __metadata('design:paramtypes', [])
    ], DayGroupComponent);
    return DayGroupComponent;
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
            .map(function (res) { return res.json(); });
        request.subscribe(function (data) { return _this.elaborateJson(data); }, function (error) { return alert(error); }, function () { return console.debug(JSON.stringify(_this.last_update_str)); });
    };
    AppComponent.prototype.stopFetch = function () {
        clearInterval(this.polling_id);
    };
    AppComponent.prototype.elaborateJson = function (json_data) {
        if (json_data.lastupdate != this.last_update_str) {
            this.last_update_str = json_data.lastupdate;
            this.dategroup_data = json_data.dategroups;
        }
    };
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'demo1',
            viewBindings: [
                http_1.HTTP_BINDINGS
            ]
        }),
        angular2_1.View({
            template: "\n    <div class=\"row\">\n        <div class=\"col-md-6 col-md-offset-3 col-xs-12\">\n            <livescore-daygroup *ng-for=\"#g of dategroup_data\" [data]=\"g\">\n            <!-- A differenza di Polymer, non possiamo innestare i children\n            <livescore-match *ng-for=\"#m of g.matches\" [data]=\"m\"></livescore-match> -->\n            </livescore-daygroup>\n        </div>\n    </div>",
            directives: [
                DayGroupComponent,
                angular2_1.NgFor
            ]
        }), 
        __metadata('design:paramtypes', [http_1.Http, angular2_1.ElementRef])
    ], AppComponent);
    return AppComponent;
})();
exports.AppComponent = AppComponent;
angular2_1.bootstrap(AppComponent, [
    angular2_1.ElementRef
]);
//# sourceMappingURL=demo1.js.map