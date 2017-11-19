angular.module('app', ['ui.router', 'chart.js'])
    .config(['$stateProvider', '$urlRouterProvider',  function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('redditAnalyzer', {
                url: '/analyze',
                component: 'redditAnalyzer'
        });
}]);