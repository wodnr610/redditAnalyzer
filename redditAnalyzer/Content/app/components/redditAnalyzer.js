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
                vm.subreddit = [];
                vm.commentsByTime = [];
                vm.availableCommentYear = [];
                vm.selectedYear;
                vm.myChart;
                vm.myChart2;


                vm.mobilecheck = function () {
                    var check = false;
                    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
                    console.log("is it mobile", check);
                    vm.check = check;
                    return check;
                };



                vm.changeYear = function (year) {
                    vm.selectedYear = year;
                    vm.myChart2.data.datasets[0].data = Object.values(vm.commentsByTime[vm.selectedYear]);
                    vm.myChart2.update();
                }

                vm.sortCommentBySub = function () {
                    for (i = 0; i < vm.comments.length; i++) {
                        for (j = 0; j < vm.comments[i].length; j++) {
                            var tempComment = vm.comments[i][j].data;
                            if (vm.subreddit[tempComment.subreddit] === undefined) {
                                vm.subreddit[tempComment.subreddit] = 1;
                            }
                            else {
                                vm.subreddit[tempComment.subreddit]++;
                            }
                        }
                    }
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
                                vm.selectedYear = vm.availableCommentYear[0];
                            }
                            vm.commentsByTime[tempYear][parseInt(vm.convertDate(tempComment.created).getMonth())]++;
                        }
                    }
                }

                vm.makeSubChart = function () {
                    setTimeout(function () {

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
                                            autoSkip: false,
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
                                        data: Object.values(vm.commentsByTime[vm.selectedYear])
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
                    vm.accountData = resolve.accountData;
                    vm.accountData.total_karma = vm.accountData.comment_karma + vm.accountData.link_karma;
                    vm.comments = resolve.allCommentsPromise;
                    vm.findBestComment();
                    vm.bestComment.date = vm.convertDate(vm.bestComment.created).toString();
                    vm.sortCommentBySub();
                    vm.sortCommentByDate();
                    vm.makeSubChart();
                    vm.mobilecheck();
                }

            }]
    });