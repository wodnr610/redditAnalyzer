angular.module('app', ['ui.router', 'chart.js'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('redditAnalyzer', {
                url: '/analyze',
                component: 'redditAnalyzer',
                resolve: {
                    data: ['$http', function ($http) {
                        return $http.get('https://www.reddit.com/user/' + 'ceej0405' + '/about.json')
                            .then(function (response) {
                                console.log("this is the response", response);
                                return response;
                            });
                    }]
                }
            })
            .state('home', {
                url: '/',
                component: 'home'
                //templateUrl: 'Content/app/components/home.html'
            });
    }]);