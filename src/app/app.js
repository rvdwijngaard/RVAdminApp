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

.controller('ApplicationController',function ($scope, $http, loginService) {
    // $http.get(baseUrl + '/account', {cache : true})
    //     .success(function(user){
    //         $scope.currentUser = user;
    //     });
    $scope.currentUser = loginService.currentUser();
    
})

.config(function ($provide, $routeProvider) {
    $routeProvider        
        .otherwise('/company');      
});
