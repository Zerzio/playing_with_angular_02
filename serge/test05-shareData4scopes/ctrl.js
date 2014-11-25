(function () {

    angular.module('test')
        .controller('ctrl1', function ($scope, stateSvc) {

            $scope.data = {};
            $scope.data.person = stateSvc.person;

            $scope.watchPerson = function() {
                _watchPerson($scope,stateSvc);
            };
        });

    angular.module('test')
        .controller('ctrl2', function ($scope, stateSvc) {

            $scope.data = {};
            $scope.data.person = stateSvc.person;
            $scope.data.getPerson = stateSvc.getPerson();

            $scope.watchPerson = function() {
                _watchPerson($scope,stateSvc);
            };
        });

    angular.module('test')
        .controller('ctrlInteract', function ($scope, stateSvc) {

            $scope.data = {};
            $scope.data.person = stateSvc.person;

            $scope.setFirstName = function(n) {
                stateSvc.person.firstName = n;
            };
            $scope.setLastName = function(n) {
                stateSvc.person.lastName = n;
            };
            $scope.setPerson = function(f,l) {
                stateSvc.updatePerson(f,l);
            };
            $scope.setPersonObject = function(p) {
                stateSvc.setPerson(p);
            };
            $scope.watchPerson = function() {
                _watchPerson($scope,stateSvc);
            };
        });

    angular.module('test')
        .controller('ctrlInteractSlow', function ($scope, stateSvc, slowSvc) {

            $scope.data = {};
            $scope.data.person = stateSvc.person;

            $scope.getPerson1 = function() {
                slowSvc.fetchPerson1();
            };
            $scope.getPerson2 = function() {
                slowSvc.fetchPerson2();
            };
            $scope.print = function() {
                stateSvc.print();
            };
            $scope.watchPerson = function() {
                _watchPerson($scope,stateSvc);
            };
        });

    angular.module('test')
        .controller('ctrlPile', function ($scope, stateSvc) {

            $scope.data = {};
            $scope.data.pile = stateSvc.pile;

        });

    var _watchPerson = function(_scope, _stateSvc) {
        _scope.$watch(function () {
            return _stateSvc.person;
        }, function (newValue) {
            console.log("WATCH person");
            _scope.data.person = _stateSvc.person;
        });
    }

})();
