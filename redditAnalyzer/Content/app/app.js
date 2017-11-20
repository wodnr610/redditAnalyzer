angular.module('app', ['ui.router', 'chart.js'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('redditAnalyzer', {
                url: '/analyze/:name',
                component: 'redditAnalyzer',
                resolve: {
                    resolve:
                    ['test', '$stateParams', function (test, $stateParams) {
                        return test.analyze($stateParams.name);
                    }
                    ]
                }
            })
            .state('home', {
                url: '/',
                component: 'home'
            });
    }]);