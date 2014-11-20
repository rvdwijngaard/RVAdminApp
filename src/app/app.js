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

.controller('ApplicationController',function ($scope, $http, loginService, companyService, $location) {
         
    $scope.getClass = function(path) {
        if ($location.path().substr(0, path.length) == path) {
            return "active";
        } else {
            return "";
        }
    };
    
    $scope.$on('event:auth-loginConfirmed', function () {
        $scope.currentUser = loginService.currentUser();   
        companyService.get().success(function(company){
            $scope.company = company;
        });
    });    
})

.config(function ($provide, $routeProvider) {
    $routeProvider        
        .otherwise('/company');      
});
