angular.module("rvAdminApp.users", ['ngRoute', 'config'])

.config(function ($provide, $routeProvider) {
	$routeProvider
		.when('/company/users', { templateUrl: 'users/users.tpl.html', controller: 'usersCtrl' });
})

.controller('usersCtrl',['$scope', 'userService', function ($scope, userService) { 
	userService.get()
		.success(function(data){
			$scope.users = data;
		});	

	$scope.save = function (account) {
		userService.save(account);
	};
}])

.factory('userService', ['$http', 'baseUrl', function($http, baseUrl){
	return {
		get : function() {
			return $http.get(baseUrl + "/accountadmin/users");
		},
		save : function(user) {
			return $http.put(baseUrl + "/accountadmin/users", user);
		}
	};
}]);