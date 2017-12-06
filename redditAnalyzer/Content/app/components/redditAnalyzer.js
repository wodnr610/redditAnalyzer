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
                vm.subreddit = [];
                vm.commentsDate = new Array(12);
                for (i = 0; i < 12; i++) {
                    vm.commentsDate[i] = 0;
                }
                vm.myChart;

                vm.sortCommentBySub = function () {
                    for (i = 0; i < vm.comments.length; i++) {
                        for (j = 0; j < vm.comments[i].length; j++) {
                            var tempSub = vm.comments[i][j].data.subreddit;
                            if (vm.subreddit[tempSub] === undefined) {
                                vm.subreddit[tempSub] = 1;
                            }
                            else {
                                vm.subreddit[tempSub]++;
                            }

                            console.log(vm.convertDate(vm.comments[i][j].data.created).getFullYear());
                            if (parseInt(vm.convertDate(vm.comments[i][j].data.created).getFullYear()) === 2017)
                            vm.commentsDate[parseInt(vm.convertDate(vm.comments[i][j].data.created).getMonth())]++;
                        }
                    }
                }

                vm.makeSubChart = function () {
                    vm.myChart = new Chart(document.getElementById("bar"), {
                        type: 'bar',
                        data: {
                            labels: Object.keys(vm.subreddit),
                            datasets: [
                                {
                                    label: "Comments",
                                    borderColor: '#cbe4fc',
                                    backgroundColor: "RGBA(239, 247, 255, 0.3)",
                                    data: Object.values(vm.subreddit)
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
                                        fontColor: "white"
                                    }
                                }]
                            }
                        }
                    });
                    vm.myChart2 = new Chart(document.getElementById("bar2"), {
                        type: 'bar',
                        data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"],
                            datasets: [
                                {
                                    label: "Comments",
                                    borderColor: '#cbe4fc',
                                    backgroundColor: "RGBA(239, 247, 255, 0.3)",
                                    data: Object.values(vm.commentsDate)
                                }
                            ]
                        },
                        options: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: 'Comments Per Month',
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
                                        fontColor: "white"
                                    }
                                }]
                            }
                        }
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


                vm.$onInit = function () {
                    var resolve = vm.resolve;
                    console.log("this is the resolve", resolve);
                    vm.accountData = resolve.accountData;
                    vm.accountData.total_karma = vm.accountData.comment_karma + vm.accountData.link_karma;
                    vm.comments = resolve.allCommentsPromise;
                    vm.findBestComment();
                    vm.bestComment.date = vm.convertDate(vm.bestComment.created).toString();
                    vm.sortCommentBySub();
                    vm.makeSubChart();
                    console.log(vm.commentsDate);
                }

            }]
    });