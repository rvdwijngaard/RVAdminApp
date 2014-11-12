angular.module("rvAdminApp.company", ['ngRoute', 'config', 'rvAdminApp.company.uploads'])

.config(function ($provide, $routeProvider) {
    $routeProvider
      .when('/company', { templateUrl: 'company/company.tpl.html', controller: 'companyCtrl' })  
      .when('/company/register', { templateUrl: 'company/register-company.tpl.html', controller: 'companyRegistrationCtrl' });
})

.controller('companyCtrl', ['$scope', 'companyService',
    function ($scope, companyService) {
        var loadCompany = function () {
            companyService.get()
            .success(function (data) {
                $scope.company = data;
            });
        };
        $scope.company = {};   

        loadCompany();            
    }])

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
}]);
