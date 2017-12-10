angular.module('app', ['ui.router', 'chart.js', 'ui.bootstrap'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('redditAnalyzer', {
                url: '/analyze/:name',
                component: 'redditAnalyzer',
                resolve: {
                    resolve:
                    ['test', '$stateParams', function (test, $stateParams) {
                        var data = test.getAnalysisData($stateParams.name);
                        return data;
                    }
                    ]
                }
            })
            .state('home', {
                url: '/',
                component: 'home'
            });
    }]);