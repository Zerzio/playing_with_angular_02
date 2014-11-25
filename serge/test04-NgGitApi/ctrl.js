(function () {

    angular.module('ngGit')
    .controller('gitCtrl', function ($scope, $http, rx, GitSvc) {

        $scope.data = {
            suggestions: [

            ]
        };

        var refreshClickObservable = $scope.$createObservableFunction('refresh');
        var closeClickObservable = $scope.$createObservableFunction('close');

        refreshClickObservable
            .subscribe(function(){
                console.log("refreshClickObservable");
                var randomOffset = Math.floor(Math.random() * 500);
                allSuggestionsObservable(randomOffset).map(get3fromArray).subscribe(observer);
            });

        closeClickObservable
            .map(function(index) {
                return index;
            })
            .subscribe(function(index){
                console.log("closeClickObservable " + index);
            });

        var allSuggestionsObservable = function(randomOffset) {
            console.log("get all suggestions");
            var all =  rx.Observable
                .fromPromise($http({
                    url: "https://api.github.com/users",
                    method: "get",
                    params: {
                        since: randomOffset
                    }
                }))
                .map(function(response){ return response.data; });
            return all;
        };

        var observer = rx.Observer.create(
            function(all) {
                //console.log(all);
                console.log("onNext");
                for (var i=0; i < all.length; i++){
                    var suggestion = all[i];
                    setSuggestionOnScope(simplifySuggestion(suggestion),i);
                }
            },
            function (err) {
                console.log('Error: %s', err.message);
            },
            function () {
                console.log('Observer has observed');
            }
        );

        var get3fromArray = function(all) {
            var three = [];
            three.push(all[Math.floor(Math.random() * all.length)]);
            three.push(all[Math.floor(Math.random() * all.length)]);
            three.push(all[Math.floor(Math.random() * all.length)]);
            return three;
        };

        var simplifySuggestion = function(suggestedUser) {
            var suggestion = {};
            suggestion.href = suggestedUser.html_url;
            suggestion.textContent = suggestedUser.login;
            suggestion.img = {
                src: suggestedUser.avatar_url
            }
            return suggestion;
        };

        var setSuggestionOnScope = function(suggestion,index) {
            $scope.data.suggestions[index] = suggestion;
        }

        var randomOffset = Math.floor(Math.random() * 500);
        var threeSuggestionsObservable = allSuggestionsObservable(randomOffset).map(get3fromArray);

        //threeSuggestionsObservable.subscribe(observer);

    })

})();
