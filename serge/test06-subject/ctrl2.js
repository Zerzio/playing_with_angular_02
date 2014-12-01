(function () {

    angular.module('test')
    .controller('ctrl2', function ($scope, $http, rx, testSvc) {

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
                                data.forEach(function(item) {
                                    observer.onNext(item);
                                });
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
            console.log("Now prepare filter...");
            var filtered = observable
                .take(3)
                .map(function(item) {
                    return {id: item.id, login: item.login}
                });
            console.log("Now subscribe...");
            var subscription = filtered
                .subscribe(
                    // observer.onNext()
                    function(data) {
                        console.log(data);
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

console.log("Now subscribe again...");
            var subscription = filtered
                .subscribe(
                    // observer.onNext()
                    function(data) {
                        console.log(data);
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
