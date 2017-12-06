angular.module('app')
    .component('home', {
        templateUrl: 'Content/app/components/home.html',
        bindings: {},
        controller: ['$http', '$state', 'test',
            function ($http, $state, test) {
                var vm = this;
                vm.userName;
                
                vm.searchReddit = function () {
                    $http.get('https://www.reddit.com/user/' + vm.userName + '/about.json')
                        .then(function (response) {
                            vm.accountData = response.data.data;
                            vm.accountData.total_karma = vm.accountData.comment_karma + vm.accountData.link_karma;
                            $state.go('redditAnalyzer', { name: vm.userName });
                        });
                }
            }
        ]
    });
