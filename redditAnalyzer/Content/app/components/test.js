angular.module('app')
    .factory('test', ['$http', '$state', function ($http, $state) {
        var vm = this;

        vm.accountData = {};
        vm.after = '';
        vm.bestComment = {};
        vm.bestComment.karma = 0;
        vm.userName;
        vm.bestComment.date = '';
        vm.subreddit = {};
        vm.myChart;

        vm.getAnalysisData = function (redditUser) {
            vm.userName = redditUser;
            vm.analyze(redditUser);
            
        }



        vm.analyze = function (user) {
            vm.resetData(user);
            vm.getAccountInfo(user);
            vm.getAllComments(user);
            return {
                accountData: vm.accountData,
                bestComment: vm.bestComment,
                userName: vm.userName,
                subreddit: vm.subreddit,
                myChart: vm.myChart
            };
        }
        vm.resetData = function (user) {
            vm.accountData = {};
            vm.after = '';
            vm.bestComment = {};
            vm.bestComment.karma = -(Math.pow(2, 53) - 1);
            vm.userName = user;
            vm.date = '';
            vm.subreddit = [];
            vm.topThreeSub = [];
        }
        vm.getAccountInfo = function (user) {
            console.log("hello there");
            $http.get('https://www.reddit.com/user/' + user + '/about.json')
                .then(function (response) {
                    vm.accountData = response.data.data;
                    vm.accountData.total_karma = vm.accountData.comment_karma + vm.accountData.link_karma;
                });
        }
        vm.getAllComments = function (user) {
            console.log("not again fkkk");
            $http.get('https://www.reddit.com/user/' + user + '/comments.json' + vm.after)
                .then(
                function (response) {
                    tempResponse = response;
                    var data = response.data.data
                    vm.after = '?after=' + data.after;
                    for (i = 0; i < data.children.length; i++) {
                        if (vm.bestComment.karma < parseInt(data.children[i].data.score)) {
                            vm.bestComment.karma = parseInt(data.children[i].data.score);
                            vm.bestComment.comment = data.children[i].data.body;
                            vm.bestComment.date = (new Date(data.children[i].data.created * 1000)).toString();
                        }
                        var tempSub = data.children[i].data.subreddit;
                        if (vm.subreddit[tempSub] === undefined) {
                            vm.subreddit[tempSub] = 1;
                        }
                        else {
                            vm.subreddit[tempSub]++;
                        }
                    }
                }, function (error) {
                    console.log(error);
                    throw error;
                })
                .catch(function (error) { });
        }
        return {
            resolve: vm.resolve,
            hello: vm.hello,
            analyze: vm.analyze
        }
    }]);
