(function (_px) {

    angular.module('example')
    .controller('ctrl-array1', function($scope, $http, rx, observeOnScope) {

        $scope.orders = [{name:"a"},{name:"b"}];

        var observableArray = rx.Observable.fromArray($scope.orders);

        var buttonObserver = Rx.Observer.create(
            function (order) {
                console.log('(from observer) onNext: ' + order.name);
                $scope.orders.push(order);
            },
            function (e) { console.log('onError: ' + e.message); },
            function () { console.log('onCompleted'); }
        );
        var buttonObservable = new Rx.Subject();
        var subscription = buttonObservable.subscribe(buttonObserver);

        var counter = 1;
        $scope.button1click = function() {
            console.log("button1click");
            var order = {
                name: "order_" + counter++,
                status: "new"
            };
            buttonObservable.onNext(order);
        };

        var orderObserver = Rx.Observer.create(
            function (x) {
                x.status = "processed";
                console.log('Next: ' + x.name);
            },
            function (err) {
                console.log('Error: ' + err);
            },
            function () {
                console.log('Completed');
            }
        );

        $scope.subscribe = function() {
            console.log("# subscribe");

            observableArray
                .filter(function (o) {
                    console.log("- filter on not processed msg");
                    o.name += "(f)";
                    return o.status !== "processed";
                })
                .map(function(o){
                    console.log("mapping:"+ o.name);
                    o.name += "-mapped";
                    return o;
                })
                .subscribe(
                    orderObserver
                );
        }

    });

})();
