/*jslint node: true */
/*global angular */
"use strict";

angular.module('config', [])
    .config([
        '$provide', function ($provide) {
            $provide.constant('env', 'dev');
            $provide.constant('baseUrl', 'https://devapi.to-increase.com/ti_account/api');
            $provide.constant('baseUrlRapidValue', 'https://devapi.to-increase.com/ti_rapidvalue/api');
        }
    ]);

