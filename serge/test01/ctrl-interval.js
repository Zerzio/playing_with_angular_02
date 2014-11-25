(function (_px) {

    angular.module('example')
    .controller('ctrl-interval', function($scope, rx, observeOnScope) {

        $scope.counter = 0;

        rx.Observable.interval(1000)
            .safeApply(
                $scope,
                function (x) { $scope.counter = x; })
            .subscribe();

        observeOnScope($scope, 'counter')
            .subscribe(function(change) {
                // this is an AnonymousObserver
                $scope.observedChange = change;
            });

        // another way
        $scope.$toObservable('counter')
            .subscribe(function (name) {
                // console.log("$toObservable: " + name);
            });

    });

})();
