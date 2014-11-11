angular.module("rvAdminApp.authentication", ['rvAdminApp.authentication.login'])

.controller('LoginController', ['$scope', '$http', '$window', 'authService', 'loginService', function ($scope, $http, $window, authService, loginService) {
    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.login = function (credentials) {
        loginService.login(credentials).then(function (response) {
            //var token = response.substr(1, response.length - 2);
            var token = response;
            authService.loginConfirmed(
                null,
                function (config) {
                    // configure the default http header, sent with all subsequent requests
                    $http.defaults.headers.common.Authorization = 'Bearer ' + token;

                    // also change the currently configured requests                    
                    config.headers.Authorization = 'Bearer ' + token;

                    $scope.setCurrentUser(credentials);

                    $window.sessionStorage.token = token;
                    // store the token in local storage
                    //localStorageService.add("token", token);
                    //var expiresDate = new Date();
                    //expiresDate.setHours(expiresDate.getHours() + 8);
                    //localStorageService.add("token_expires", expiresDate.toISOString());

                    return config;
                });
        });
    };
}])

.directive('authApplication', ['$http', 'authService', '$window', function ($http, authService, $window) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {

            var login = elem.find('#login-holder');
            var main = elem.find('#content');

            login.hide();

            scope.$on('event:auth-loginRequired', function () {
                var token = $window.sessionStorage.token;
                if (token) {
                    // but needs to deal with expired tokens
                    authService.loginConfirmed(
                            null,
                            function (config) {
                                $http.defaults.headers.common.Authorization = 'Bearer ' + token;
                                config.headers.Authorization = 'Bearer ' + token;

                                return config;
                            });

                    return;
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
}])

.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
    return this;
})

.factory('loginService', ['$http', 'Session', 'baseUrl', function ($http, Session, baseUrl) {
    var loginService = {};
    loginService.login = function (credentials) {
        // remove the obsolete authorization token
        $http.defaults.headers.common.Authorization = '';
        return $http
          .post(baseUrl + '/login', credentials)
          .then(function (res) {
              //Session.create(res.data.id, res.data.user.id,
              //               res.data.user.role);
              return res.data;
          });
    };

    loginService.logout = function () {
        $window.sessionStorage.token = '';
    };

    return loginService;
}])

.factory('loginService', ['$http', 'Session', 'baseUrl', function ($http, Session, baseUrl) {
    var loginService = {};
    loginService.login = function (credentials) {
        // remove the obsolete authorization token
        $http.defaults.headers.common.Authorization = '';
        return $http
          .post(baseUrl + '/login', credentials)
          .then(function (res) {
              //Session.create(res.data.id, res.data.user.id,
              //               res.data.user.role);
              return res.data;
          });
    };

    return loginService;
}]);
