(function (_px) {

    angular.module('example')
    .controller('ctrl-pxEmitter', function($scope) {

        $scope.$createObservableFunction('pxEmitter')
            .subscribe(function pxEmitterImpl(arg) {
                console.log("emit event : " + arg);
                _px.globalEmitter1.emit("test",arg);
            });

    });

})($px);
