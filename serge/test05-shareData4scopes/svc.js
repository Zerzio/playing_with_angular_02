(function () {

    angular.module('test')
        .factory('stateSvc', function() {

            var factory = {
                person : {
                    firstName: '',
                    lastName: ''
                },
                pile: [],
                updatePerson: function(first, last) {
                    this.person.firstName = first;
                    this.person.lastName = last;
                    this.pile.push({item:"updatePerson(" + first + "," + last + ")"});
                },
                getPerson: function() {
                    console.log("stateSvc.getPerson()");
                    console.log(this.person);
                    return this.person;
                },
                setPerson: function(p) {
                    console.log("stateSvc.updatePersonObject(" + p + ")");
                    this.pile.push({item:"setPerson(" + p.firstName + "," + p.lastName + ")"})
                    this.person = p;
                    console.log(this.person);
                },
                print: function() {
                    console.log(this);
                }
            };
            factory.pile.push({item:"See how the collection is growing... with or without WATCH"});

            return factory;

        });

    angular.module('test')
        .factory('slowSvc', function(stateSvc, $timeout) {

            var counter = 0;

            var getPersonFromSomewhere = function() {
                console.log("slowSvc.getPersonFromSomewhere()");
                counter++;
                var person = {
                    firstName: 'Tomas' + counter,
                    lastName: 'Stradivarius' + counter
                }
                return person;
            };

            var factory = {
                fetchPerson1: function() {
                    var p = getPersonFromSomewhere();
                    $timeout(function() {
                        stateSvc.updatePerson(p.firstName, p.lastName);
                    },1000);

                }
                ,
                fetchPerson2: function() {
                    var p = getPersonFromSomewhere();
                    p.firstName += " (OBJ)";
                    p.lastName += " (OBJ)";
                    $timeout(function() {
                        stateSvc.setPerson(p);
                    },1000);
                }
            };

            return factory;

        });

})();
