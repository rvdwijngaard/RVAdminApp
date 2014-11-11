angular.module("rvAdminAppa", ['ngRoute', 'config'])

.controller('accountsCtrl',['$scope', 'accountsService', function ($scope, accountsService) { 
	
	$scope.data = accountsService.get();

	$scope.save = function (account) {
		accountsService.save(account);
	};
}])

.factory('testService', ['$http', function($http){
	return {
		test : function() {
			return $http.get("");
		}
	};
}])

.factory('accountsService', ['$http', 'baseUrl', function($http, $baseUrl){
	return {
		get : function() {
			return $http.get(baseUrl + "/accountsadmin");
		},
		save : function(account) {
			return $http.post(baseUrl + "/accountsadmin", account);
		}
	};
}]);