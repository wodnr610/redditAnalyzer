angular.module('app')
    .component('home', {
        templateUrl: 'Content/app/components/home.html',
        bindings: {},
        controller: ['$http', '$state',
            function ($http, $state) {
                var vm = this;
                vm.accountData = {};
                vm.after = '';
                vm.bestComment = {};
                vm.bestComment.karma = 0;
                vm.userName;
                vm.bestComment.date = '';
                vm.subreddit = {};
                vm.myChart;



                vm.analyze = function (user) {
                    vm.resetData();
                    vm.getAccountInfo(user);
                    vm.getAllComments(user);
                }
                vm.resetData = function () {
                    vm.accountData = {};
                    vm.after = '';
                    vm.bestComment = {};
                    vm.bestComment.karma = -(Math.pow(2, 53) - 1);
                    vm.userName;
                    vm.date = '';
                    vm.subreddit = [];
                    vm.topThreeSub = [];
                }
                vm.getAccountInfo = function (user) {
                    $http.get('https://www.reddit.com/user/' + vm.userName + '/about.json')
                        .then(function (response) {
                            vm.accountData = response.data.data;
                            vm.accountData.total_karma = vm.accountData.comment_karma + vm.accountData.link_karma;
                        });
                }
                vm.getAllComments = function (user) {
                    console.log("hello again");

                    $http.get('https://www.reddit.com/user/' + user + '/comments.json' + vm.after)
                        .then(
                        function (response) {
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
                            if (response.data.data.after != null) {
                                vm.getAllComments(user);
                            }
                            else {
                                console.log("this is it ", Object.values(vm.subreddit));
                                $state.go('redditAnalyzer', vm.bestComment);
                                //vm.myChart = new Chart(document.getElementById("bar"), {
                                //    type: 'bar',
                                //    data: {
                                //        labels: Object.keys(vm.subreddit),
                                //        datasets: [
                                //            {
                                //                label: "Comments",
                                //                borderColor: '#cbe4fc',
                                //                backgroundColor: "RGBA(239, 247, 255, 0.3)",
                                //                data: Object.values(vm.subreddit)
                                //            }
                                //        ]
                                //    },
                                //    options: {
                                //        legend: { display: false },
                                //        title: {
                                //            display: true,
                                //            text: 'Comments Per Subreddit'
                                //        }
                                //    }
                                //});
                            }
                        }, function (error) {
                            throw error;
                        })
                        .catch(function (error) { });
                }
                
            }]
    });
