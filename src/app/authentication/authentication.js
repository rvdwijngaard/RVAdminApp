angular.module("rvAdminApp.authentication", [])

.controller('LoginController', ['$scope', '$http', '$window', 'loginService', function ($scope, $http, $window, loginService) {
    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.login = function (credentials) {
        loginService.login(credentials);
    };

    $scope.logout = function() {
        loginService.logout();
    };
}])

.directive('authApplication', function ($http, loginService) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {

            var login = elem.find('#login-holder');
            var main = elem.find('#content');

            login.hide();

            scope.$on('event:auth-loginRequired', function () {
                var currentUser = loginService.currentUser();
                if (currentUser) {
                    // but needs to deal with expired tokens
                    loginService.loginConfirmed(currentUser);                            
                } else {
                    login.show();
                    main.hide();
                }
            });
            scope.$on('event:auth-loginConfirmed', function () {
                main.show();
                login.hide();
            });
        }
    };
})


.factory('loginService', function ($http, $q, baseUrl, authService, $window) {
    var loginService = {};    
    
    _loginConfirmed = function(currentUser) {                  
        // but needs to deal with expired tokens
        authService.loginConfirmed(
                null,
                function (config) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + currentUser.AccessToken;
                    config.headers.Authorization = 'Bearer ' + currentUser.AccessToken;

                    return config;
                });
    };

    loginService.login = function (credentials) {
        var d = new $q.defer();
        // remove the obsolete authorization token
        $http.defaults.headers.common.Authorization = '';
        $http.post(baseUrl + '/login', credentials)
            .then(function (resp) {     
                var user = resp.data;
                $window.sessionStorage.currentUser = JSON.stringify(user);
                this.LoginConfirmed(user);
                d.resolve();
            });
        return d.promise;
    };
    
    loginService.logout = function () {
        $window.sessionStorage.removeItem('currentUser');
    };

    loginService.currentUser = function() {
        var u = sessionStorage.getItem('currentUser');
        return JSON.parse(u);
    };

    loginService.loginConfirmed = function(user) {
        _loginConfirmed(user);
    };

    return loginService;
});
