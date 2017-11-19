angular.module('app')
    .component('test', {
        templateUrl: 'Content/app/components/test.html',
        bindings: {},
        controller: [
            function () {
                var vm = this;
                vm.$onInit = function () {
                    console.log("suppppppppp")
                }


            }]
    });