(function (_px) {

    angular.module('example')
    .controller('ctrl-event', function($scope) {

        $scope.
        $eventToObservable('myEvent')
            .subscribe(function (data) {
                console.log('(obs1) Event name %s', data.event.name);
                $scope.data = data;
            });

        $scope.
        $eventToObservable('myEvent')
            .subscribe(function (data) {
                console.log('(obs2) Event name %s', data.event.name);
            });

        $scope.emitEvent = function emitEvent() {
            $scope.$emit('myEvent', 'foo', 'bar');
        };

        $scope.emitEvent();

    });

})();
