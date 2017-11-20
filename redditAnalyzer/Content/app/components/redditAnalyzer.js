angular.module('app')
    .component('redditAnalyzer', {
        templateUrl: 'Content/app/components/redditAnalyzer.html',
        bindings: {
            resolve: '<'
        },
        controller: ['$http', 'test',
            function ($http, test) {
                var vm = this;
                vm.accountData = {};
                vm.bestComment = {};
                vm.bestComment.karma = 0;
                vm.userName;
                vm.bestComment.date = '';
                vm.subreddit = {};
                vm.myChart;
                
                vm.$onInit = function () {
                    console.log("this is the resolve", vm.resolve);
                    //vm.accountData = resolve.accountData;
                    //vm.bestComment = resolve.bestComment;
                    //vm.myChart = resolve.myChart;
                    //vm.subreddit = resolve.subreddit;
                    //vm.userName = resolve.userName;
                }

            }]
    });