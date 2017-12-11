angular.module('app')
    .component('redditAnalyzer', {
        templateUrl: 'Content/app/components/redditAnalyzer.html',
        bindings: {
            resolve: '<'
        },
        controller: ['$http', 'test', '$window',
            function ($http, test, $window) {
                var vm = this;
                vm.activeTab = [];
                vm.accountData = {};
                vm.bestComment = {};
                vm.subredditComment = [];
                vm.subredditPost = [];
                vm.commentsByTime = [];
                vm.postsByTime = [];
                vm.availableCommentYear = [];
                vm.availablePostYear = [];
                vm.selectedCommentYear;
                vm.selectedPostYear;
                vm.commentsPerSubChart;
                vm.commentsPerYearChart;
                vm.commentKarmaPerDate = [];
                vm.postKarmaPerDate = [];
                vm.karmaPerDate = [];
                vm.commentAcculKarma = [];
                vm.postAcculKarma = [];
                var postDateArr = [];

                vm.changeCommentYear = function (year) {
                    vm.selectedCommentYear = year;
                    vm.commentsPerYearChart.data.datasets[0].data = Object.values(vm.commentsByTime[vm.selectedCommentYear]);
                    vm.commentsPerYearChart.update();
                }
                vm.changePostYear = function (year) {
                    vm.selectedPostYear = year;
                    vm.postsPerYearChart.data.datasets[0].data = Object.values(vm.postsByTime[vm.selectedPostYear]);
                    vm.postsPerYearChart.update();
                }
                

                vm.sumPostKarma = function () {
                    console.log("Start");
                    var accul = 0;
                    for (var key in vm.postKarmaPerDate) {
                        postDateArr.push(key);
                    }
                    for (var i = postDateArr.length - 1; i >= 0; i--) {
                        accul += vm.postKarmaPerDate[postDateArr[i]];
                        vm.postAcculKarma[postDateArr[i]] = accul;
                    }
                }

                vm.sortCommentBySub = function () {
                    for (i = 0; i < vm.comments.length; i++) {
                        for (j = 0; j < vm.comments[i].length; j++) {
                            var tempComment = vm.comments[i][j].data;
                            if (vm.subredditComment[tempComment.subreddit] === undefined) {
                                vm.subredditComment[tempComment.subreddit] = 1;
                            }
                            else {
                                vm.subredditComment[tempComment.subreddit]++;
                            }
                        }
                    }
                }
                vm.sortPostBySub = function () {
                    for (i = 0; i < vm.posts.length; i++) {
                        for (j = 0; j < vm.posts[i].length; j++) {
                            var tempPost = vm.posts[i][j].data;
                            if (vm.subredditPost[tempPost.subreddit] === undefined) {
                                vm.subredditPost[tempPost.subreddit] = 1;
                            }
                            else {
                                vm.subredditPost[tempPost.subreddit]++;
                            }
                        }
                    }
                }

                vm.sortPostByDate = function () {
                    for (i = 0; i < vm.posts.length; i++) {
                        for (j = 0; j < vm.posts[i].length; j++) {
                            var tempPost = vm.posts[i][j].data;
                            var tempDate = vm.convertDate(tempPost.created)
                            var tempYear = parseInt(tempDate.getFullYear());
                            var postDate = tempDate.getFullYear().toString() + "-" + tempDate.getMonth().toString() + "-" + tempDate.getDate().toString();
                            if (vm.postKarmaPerDate[postDate] === undefined) {
                                vm.postKarmaPerDate[postDate] = tempPost.score;
                            }
                            else {
                                vm.postKarmaPerDate[postDate] += tempPost.score;
                            }

                            if (vm.postsByTime[tempYear] === undefined) {
                                vm.availablePostYear.push(tempYear);
                                vm.postsByTime[tempYear] = new Array(12);
                                for (k = 0; k < 12; k++) {
                                    vm.postsByTime[tempYear][k] = 0;
                                }
                                vm.selectedPostYear = vm.availablePostYear[0];
                            }
                            vm.postsByTime[tempYear][parseInt(vm.convertDate(tempPost.created).getMonth())]++;
                        }
                    }
                    vm.sumPostKarma();
                }
                vm.sortCommentByDate = function () {
                    for (i = 0; i < vm.comments.length; i++) {
                        for (j = 0; j < vm.comments[i].length; j++) {
                            var tempComment = vm.comments[i][j].data;
                            var tempYear = parseInt(vm.convertDate(tempComment.created).getFullYear());
                            if (vm.commentsByTime[tempYear] === undefined) {
                                vm.availableCommentYear.push(tempYear);
                                vm.commentsByTime[tempYear] = new Array(12);
                                for (k = 0; k < 12; k++) {
                                    vm.commentsByTime[tempYear][k] = 0;
                                }
                                vm.selectedCommentYear = vm.availableCommentYear[0];
                            }
                            vm.commentsByTime[tempYear][parseInt(vm.convertDate(tempComment.created).getMonth())]++;
                        }
                    }
                }

                vm.makeSubChart = function () {
                    setTimeout(function () {

                        vm.commentsPerSubChart = new Chart(document.getElementById("comment-per-sub"), {
                            type: 'bar',
                            data: {
                                labels: Object.keys(vm.subredditComment),
                                datasets: [
                                    {
                                        label: "Comments",
                                        borderColor: 'RGBA(67, 117, 242, 1)',
                                        backgroundColor: "RGBA(67, 117, 242, 0.3)",
                                        data: Object.values(vm.subredditComment)
                                    }
                                ]
                            },
                            options: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: 'Comments Per Subreddit',
                                    fontColor: "white"
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            fontColor: "white"
                                        }
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            autoSkip: false,
                                            fontColor: "white"
                                        }
                                    }]
                                }
                            }
                        });

                        vm.commentsPerYearChart = new Chart(document.getElementById("comment-per-year"), {
                            type: 'bar',
                            data: {
                                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"],
                                datasets: [
                                    {
                                        label: "Comments",
                                        borderColor: '#cbe4fc',
                                        backgroundColor: "RGBA(239, 247, 255, 0.3)",
                                        data: Object.values(vm.commentsByTime[vm.selectedCommentYear])
                                    }
                                ]
                            },
                            options: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: 'Comments Per Year',
                                    fontColor: "white"
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            fontColor: "white"
                                        }
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            autoSkip: false,
                                            fontColor: "white"
                                        }
                                    }]
                                }
                            }
                        });

                        vm.PostsPerSubChart = new Chart(document.getElementById("post-per-sub"), {
                            type: 'bar',
                            data: {
                                labels: Object.keys(vm.subredditPost),
                                datasets: [
                                    {
                                        label: "Posts",
                                        borderColor: '#cbe4fc',
                                        backgroundColor: "RGBA(239, 247, 255, 0.3)",
                                        data: Object.values(vm.subredditPost)
                                    }
                                ]
                            },
                            options: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: 'Posts Per Subreddit',
                                    fontColor: "white"
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            fontColor: "white"
                                        }
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            autoSkip: false,
                                            fontColor: "white"
                                        }
                                    }]
                                }
                            }
                        }); 

                        vm.postsPerYearChart = new Chart(document.getElementById("post-per-year"), {
                            type: 'bar',
                            data: {
                                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"],
                                datasets: [
                                    {
                                        label: "Posts",
                                        borderColor: "RGBA(175, 242, 67, 1)",
                                        backgroundColor: "RGBA(175, 242, 67, 0.3)",
                                        data: Object.values(vm.postsByTime[vm.selectedPostYear])
                                    }
                                ]
                            },
                            options: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: 'Posts Per Year',
                                    fontColor: "white"
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            fontColor: "white"
                                        }
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            autoSkip: false,
                                            fontColor: "white"
                                        }
                                    }]
                                }
                            }
                        });

                        vm.postsKarmaHistory = new Chart(document.getElementById("post-karma-history"), {
                            type: 'line',
                            data: {
                                labels: postDateArr.reverse(),
                                datasets: [
                                    {
                                        label: "Karma",
                                        borderColor: "RGBA(131, 244, 66, 1)",
                                        backgroundColor: "RGBA(131, 244, 66, 0.3)",
                                        data: Object.values(vm.postAcculKarma)
                                    }
                                ]
                            },
                            options: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: 'Post Karma History',
                                    fontColor: "white"
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            fontColor: "white"
                                        }
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            autoSkip: true,
                                            fontColor: "white"
                                        }
                                    }]
                                }
                            }
                        });
                    });
                }

                vm.findBestComment = function () {
                    vm.bestComment = vm.comments[0][0].data;
                    for (i = 0; i < vm.comments.length; i++) {
                        for (j = 0; j < vm.comments[i].length; j++) {
                            if (vm.comments[i][j].data.score > vm.bestComment.score)
                                vm.bestComment = vm.comments[i][j].data;
                        }
                    }
                }

                vm.convertDate = function (date) {
                    var convertedDate = (new Date(date * 1000));
                    return convertedDate;
                }

                vm.setTab = function (tabName) {
                    vm.activeTab.account = tabName == 'account' ? true : false;
                    vm.activeTab.posts = tabName == 'posts' ? true : false;
                    vm.activeTab.comments = tabName == 'comments' ? true : false;
                    vm.activeTab.karma = tabName == 'karma' ? true : false;
                }

                vm.$onInit = function () {
                    var resolve = vm.resolve;
                    console.log("this is respoinse", resolve);
                    vm.accountData = resolve.accountData;
                    vm.accountData.total_karma = vm.accountData.comment_karma + vm.accountData.link_karma;
                    vm.comments = resolve.allCommentsPromise;
                    vm.posts = resolve.allPostPromise;
                    vm.findBestComment();
                    vm.bestComment.date = vm.convertDate(vm.bestComment.created).toString();
                    vm.sortCommentBySub();
                    vm.sortCommentByDate();
                    vm.sortPostBySub();
                    vm.sortPostByDate();
                    vm.makeSubChart();
                    console.log(vm.postAcculKarma);
                    
                }

            }]
    });