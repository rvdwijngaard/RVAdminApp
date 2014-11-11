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
    'config'
])

.controller('ApplicationController', function ($scope) {
    $scope.currentUser = null;        

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };   
})

.config(function ($provide, $routeProvider) {
    $routeProvider        
        .otherwise('/company');      
});
