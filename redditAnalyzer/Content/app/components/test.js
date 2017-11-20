angular.module('app')
    .component('test', {
        bindings: {},
        controller: [
            function () {
                var vm = this;
                vm.test = function () {
                    return 'lol';
                }

            }]
    });
