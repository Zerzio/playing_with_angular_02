(function () {

    angular.module('test')
    .controller('ctrl1', function ($scope, $http, rx, testSvc) {

            var subject = new rx.Subject();

            function getObserver(name) {
                var observer = Rx.Observer.create(
                    function (x) {
                        console.log(name + '- next: %s', x);
                    },
                    function (err) {
                        console.log(name + '- error: %s', err);
                    },
                    function () {
                        console.log(name + '- completed');
                    });
                return observer;
            }


            subject
                .filter(function(o) {
                    var toProcess = o > 50;
                    return toProcess;
                })
                .take(3)
                .map(function(o) {
                    console.log(o);
                    return o+1;
                })
                .subscribe(getObserver("obs1"));

            subject.subscribe(getObserver("obs2"));

            subject.onNext(10);
            subject.onNext(20);
            subject.onNext(30);
            subject.onNext(40);
            subject.onNext(50);
            subject.onNext(60);
            subject.onNext(70);
            subject.onNext(80);
            subject.onNext(90);
            subject.onNext(100);

            console.log("completing subject");
            subject.onCompleted();

            subject.onNext(200);

            subject.dispose();

            try {
                subject.onNext(56);
            } catch (e) {
                console.log("ERROR: " + e.message);
            }



    })

})();
