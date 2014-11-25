(function () {

    angular.module('ngGit')
        .controller('gitCtrl', function ($scope, $http, rx, GitSvc) {

            $scope.data = {
                suggestions: []
            };

            var createGitURL = function() {
                var randomOffset = Math.floor(Math.random() * 500);
                var url = 'https://api.github.com/users?since=' + randomOffset;
                console.log("- requestStream url = " + url);
                return url;
            };

            var createSuggestionStreamFrom = function(closeClickStream) {
                console.log("# createSuggestionStreamFrom " + closeClickStream);
                var ooo =  closeClickStream
                    .startWith('startup click')
                    .combineLatest(NG_responseStream,
                    function (click, listUsers) {
                        var user = listUsers[Math.floor(Math.random() * listUsers.length)];
                        console.log("- user: " + user);
                        return user;
                    }
                )
                    .merge(
                    NG_refreshClickStream.map(
                        function () {
                            console.log("? map");
                            return null;
                        }
                    )
                )
                    .startWith(null);
                return ooo;
            };

            var updateSuggestionScope= function(suggestedUser, index) {
                console.log("### updateSuggestionScope");
                var suggestion = {};
                if (suggestedUser === null) {
                    console.log("- updateSuggestionScope - no suggestedUser")
                    suggestion.show = false;
                } else {
                    console.log("- updateSuggestionScope - " + suggestedUser.login);
                    suggestion.show = true;
                    suggestion.href = suggestedUser.html_url;
                    suggestion.textContent = suggestedUser.login;
                    suggestion.img = {
                        src: suggestedUser.avatar_url
                    }
                }
                $scope.data.suggestions[index] = suggestion;

                console.log(suggestion);
            };

            console.log("// NG Initializing button events");
            var NG_refreshClickStream = $scope.$createObservableFunction('refresh');
            var NG_close1ClickStream = $scope.$createObservableFunction('close1');
            var NG_close2ClickStream = $scope.$createObservableFunction('close2');
            var NG_close3ClickStream = $scope.$createObservableFunction('close3');

            console.log("// Initialize NG_requestStream");
            var NG_requestStream = NG_refreshClickStream.startWith('NG startup click').map(createGitURL);

            console.log("// Initialize NG_responseStream");
            var NG_responseStream = NG_requestStream
                .flatMap(function (requestUrl) {
                    console.log("* Call to " + requestUrl);
                    var obsProm = rx.Observable.fromPromise($.getJSON(requestUrl));
                    /*
                     var obsProm = rx.Observable.fromPromise(
                     $http({
                     url: requestUrl
                     })
                     );
                     */
                    return obsProm;
                })
                .publish()
                .refCount();
            console.log("- NG_responseStream = " + NG_responseStream);

            console.log("// Initialize suggestionStreams");
            var suggestion1Stream = createSuggestionStreamFrom(NG_close1ClickStream);
            var suggestion2Stream = createSuggestionStreamFrom(NG_close2ClickStream);
            var suggestion3Stream = createSuggestionStreamFrom(NG_close3ClickStream);

            suggestion1Stream.subscribe(function (suggestedUser) {
                console.log("# suggestion1Stream.subscribe-update");
                updateSuggestionScope(suggestedUser, 0);
            });

            suggestion2Stream.subscribe(function (suggestedUser) {
                console.log("# suggestion2Stream.subscribe-update");
                updateSuggestionScope(suggestedUser, 1);
            });

            suggestion3Stream.subscribe(function (suggestedUser) {
                console.log("# suggestion3Stream.subscribe-update");
                updateSuggestionScope(suggestedUser, 2);
            });

        });

})();
