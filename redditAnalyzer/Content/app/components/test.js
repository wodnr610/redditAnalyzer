angular.module('app')
    .factory('test', ['$http', '$state', '$q', function ($http, $state, $q) {
        var vm = this;

        vm.accountData = {};
        vm.commentAfter = '';
        vm.postAfter = '';
        vm.bestComment = {};
        vm.bestComment.karma = 0;
        vm.userName;
        vm.bestComment.date = '';
        vm.subreddit = {};
        vm.myChart;
        var allComments = [];
        var allPost = [];

        vm.getAnalysisData = function (redditUser) {
            console.log("loading");
            vm.userName = redditUser;
            vm.resetData(redditUser);
            var accountPromise = vm.getAccountInfo(redditUser);
            var allCommentsPromise = vm.getAllComments(redditUser);
            var allPostPromise = vm.getAllPosts(redditUser);
            return $q.all({
                accountData: accountPromise,
                allCommentsPromise: allCommentsPromise,
                allPostPromise: allPostPromise
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
            return $http.get('https://www.reddit.com/user/' + user + '/comments.json' + vm.commentAfter)
                .then(
                function (response) {
                    tempResponse = response;
                    var data = response.data.data;
                    allComments.push(data.children);
                    vm.commentAfter = '?after=' + data.after;
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
        vm.getAllPosts = function (user) {
            return $http.get('https://www.reddit.com/user/' + user + '/submitted.json' + vm.postAfter)
                .then(
                function (response) {
                    tempResponse = response;
                    var data = response.data.data;
                    allPost.push(data.children);
                    vm.postAfter = '?after=' + data.after;
                    if (response.data.data.after != null) {
                        console.log("sup");
                        return vm.getAllPosts(user);
                    }
                    else {
                        return allPost;
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
