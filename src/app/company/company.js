angular.module("rvAdminApp.company", ['ngRoute', 'config', 'rvAdminApp.company.uploads'])

.config(function ($provide, $routeProvider) {
    $routeProvider
      .when('/company', { templateUrl: 'company/company.tpl.html'})  
      .when('/company/register', { templateUrl: 'company/register-company.tpl.html', controller: 'companyRegistrationCtrl' });
})

.controller('companyRegistrationCtrl', ['$scope', 'companyService', '$location',
    function($scope, companyService, $location) {

        $scope.register = function (company) {
                    companyService.register(company)
                        .success(function (data) {
                            $scope.company = data;
                            $location.path("/");
                        })
                        .error(function (status) {
                            console.log(status);
                        });
                };
    }])

.factory('companyService', ['$http', 'baseUrl', '$q', function ($http, baseUrl, $q) {               
    return {
        get : function() {
            return $http.get(baseUrl + "/companyaccount"); 
        },
        register: function (company) {
            var request = {
                emailaddress: company.email,
                name: company.name,
                username: company.username,
                password: company.password
            };
            return $http.post(baseUrl + "/companyaccount", request);
        }
    };
}])

.directive('match', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});
