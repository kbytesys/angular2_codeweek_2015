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
var LivescoreService = (function () {
    function LivescoreService(http) {
        this.name = 'Pascal';
        this.http = http;
    }
    LivescoreService.prototype.getName = function () {
        return this.name;
    };
    LivescoreService.prototype.searchMatch = function (searchString) {
    };
    LivescoreService.prototype.getJsonData = function () {
    };
    LivescoreService = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], LivescoreService);
    return LivescoreService;
})();
var LivescoreSummaryComponent = (function () {
    function LivescoreSummaryComponent(livescoreService) {
        this.name = livescoreService.getName();
    }
    LivescoreSummaryComponent = __decorate([
        angular2_1.Component({
            selector: 'livescore-summary',
            properties: ['name']
        }),
        angular2_1.View({
            template: '<h1>{{ name }}</h1>'
        }), 
        __metadata('design:paramtypes', [LivescoreService])
    ], LivescoreSummaryComponent);
    return LivescoreSummaryComponent;
})();
var LivescoreSearchComponent = (function () {
    function LivescoreSearchComponent(livescoreService) {
        this.name = livescoreService.getName();
    }
    LivescoreSearchComponent = __decorate([
        angular2_1.Component({
            selector: 'livescore-search',
            properties: ['name']
        }),
        angular2_1.View({
            template: '<h1>Suino: {{ name }}</h1>'
        }), 
        __metadata('design:paramtypes', [LivescoreService])
    ], LivescoreSearchComponent);
    return LivescoreSearchComponent;
})();
var DemoApp2Compnent = (function () {
    function DemoApp2Compnent() {
    }
    DemoApp2Compnent = __decorate([
        angular2_1.Component({
            selector: 'demo2'
        }),
        angular2_1.View({
            template: "\n    <div class=\"row\">\n        <div class=\"col-md-6\">\n            <livescore-summary></livescore-summary>\n        </div>\n        <div class=\"col-md-6\">\n            <livescore-search></livescore-search>\n        </div>\n    </div>\n    ",
            directives: [
                LivescoreSummaryComponent,
                LivescoreSearchComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], DemoApp2Compnent);
    return DemoApp2Compnent;
})();
angular2_1.bootstrap(DemoApp2Compnent, [
    http_1.HTTP_BINDINGS,
    LivescoreService
]);
//# sourceMappingURL=demo2.js.map