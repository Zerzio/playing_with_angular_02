(function (_px) {

    angular.module('example')
    .controller('ctrl-obs-fn', function($scope) {

        $scope.$createObservableFunction('clickMe')
            .map(function(a) {
                return a;
            })
            .subscribe(function clickMeImpl(arg) {
                console.log("AnonymousObserver _onNext : " + arg);
            });
/*
        $scope.$apply(function () {
            $scope.clickMe('ObservableFunction clickMe');
        });
*/
    });

})();
