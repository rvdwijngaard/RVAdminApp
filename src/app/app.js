/*jslint node: true */
/*global angular */
"use strict";

angular.module("rvAdminApp", [
    'templates-app',
    'templates-common',
    'ngRoute',
    'http-auth-interceptor',
    'ui.bootstrap',
    'rvAdminApp.company',
    'rvAdminApp.authentication',
    'rvAdminApp.users',
    'config'
])

.controller('ApplicationController',function ($scope, $http, loginService, companyService) {
    $scope.currentUser = loginService.currentUser();    
    companyService.get().success(function(company){
        $scope.company = company;
    });

})


.config(function ($provide, $routeProvider) {
    $routeProvider        
        .otherwise('/company');      
});
