angular.module('app', ['ui-router'])
    .config(['$stateProvider', function ($stateProvider) {
    var analyzeState = {
        name: 'analyze',
        url: '/analyze',
        component: 'redditAnalyzer'
    };
    $stateProvider.state(analyzeState);
}]);