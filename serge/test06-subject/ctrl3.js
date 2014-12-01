(function () {

    angular.module('test')
    .controller('ctrl3', function ($scope, $http, rx, testSvc) {

            var observableArray;

            function getObserver(name) {
                var observer = Rx.Observer.create(
                    function (x) {
                        console.log(name + '- next: %s', x.login);
                    },
                    function (err) {
                        console.log(name + '- error: %s', err);
                    },
                    function () {
                        console.log(name + '- completed');
                    });
                return observer;
            }

            var getJSON = function(url) {
                return rx.Observable.create(function(observer) {
                    var subscribed = true;
                    console.log("getting " + url);
                    $http.get(url)
                        .success(function(data, status, headers, config) {
                            console.log("received: " + data);
                            // If client is still interested in the results, send them.
                            if (subscribed) {
                                // Send data to the client
                                observer.onNext(data);
                                // Immediately complete the sequence
                                observer.onCompleted();
                            }
                        })
                        .error(function(ex) {
                            // If client is still interested in the results, send them.
                            if (subscribed) {
                                // Inform the client that an error occurred.
                                observer.onError(ex);
                            }
                        });

                    // Definition of the Subscription objects dispose() method.
                    return function() {
                        subscribed = false;
                    }
                });
            };
            console.log("Create observable...");
            var observable = getJSON("https://api.github.com/users");
            console.log("Now subscribe...");
            var subscription = observable
                .subscribe(
                    // observer.onNext()
                    function(data) {
                        console.log(data);
                        console.log("prepare observableArray");
                        observableArray = rx.Observable.fromArray(data);
                        var subs1 = getObserver("test1");
                        observableArray.take(3).subscribe(subs1);
                        var subs2 = getObserver("test2");
                        observableArray.take(3).subscribe(subs2);
                    },
                    // observer.onError()
                    function(err) {
                        console.log("ERROR:" + err)
                    },
                    // observer.onCompleted()
                    function() {
                        console.log("The asynchronous operation has completed.")
                    }
                );



    })

})();
