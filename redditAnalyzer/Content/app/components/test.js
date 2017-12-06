angular.module('app')
    .factory('test', ['$http', '$state', '$q', function ($http, $state, $q) {
        var vm = this;

        vm.accountData = {};
        vm.after = '';
        vm.bestComment = {};
        vm.bestComment.karma = 0;
        vm.userName;
        vm.bestComment.date = '';
        vm.subreddit = {};
        vm.myChart;
        var allComments = [];

        vm.getAnalysisData = function (redditUser) {
            vm.userName = redditUser;
            vm.resetData(redditUser);
            var accountPromise = vm.getAccountInfo(redditUser);
            var allCommentsPromise = vm.getAllComments(redditUser);
            return $q.all({
                accountData: accountPromise,
                allCommentsPromise: allCommentsPromise
            });
        }
        
        vm.resetData = function (user) {
            allComments = [];
        }

        vm.getAccountInfo = function (user) {
            return $http.get('https://www.reddit.com/user/' + user + '/about.json')
                .then(function (response) {
                    return response.data.data;
                });
        }
        vm.getAllComments = function (user) {
            return $http.get('https://www.reddit.com/user/' + user + '/comments.json' + vm.after)
                .then(
                function (response) {
                    console.log("I got the comment info!");
                    tempResponse = response;
                    var data = response.data.data;
                    allComments.push(data.children);
                    vm.after = '?after=' + data.after;
                    //for (i = 0; i < data.children.length; i++) {
                    //    if (vm.bestComment.karma < parseInt(data.children[i].data.score)) {
                    //        vm.bestComment.karma = parseInt(data.children[i].data.score);
                    //        vm.bestComment.comment = data.children[i].data.body;
                    //        vm.bestComment.date = (new Date(data.children[i].data.created * 1000)).toString();
                    //    }
                    //    var tempSub = data.children[i].data.subreddit;
                    //    if (vm.subreddit[tempSub] === undefined) {
                    //        vm.subreddit[tempSub] = 1;
                    //    }
                    //    else {
                    //        vm.subreddit[tempSub]++;
                    //    }
                    //}
                    if (response.data.data.after != null) {
                        return vm.getAllComments(user);
                    }
                    else {
                        return allComments;
                    }
                }, function (error) {
                    console.log(error);
                    throw error;
                });
        }
        return {
            resolve: vm.resolve,
            hello: vm.hello,
            getAnalysisData: vm.getAnalysisData
        }
    }]);
