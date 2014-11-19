angular.module("rvAdminApp.users", ['ngRoute', 'config'])

.config(function ($provide, $routeProvider) {
	$routeProvider
		.when('/users', { templateUrl: 'users/users.tpl.html', controller: 'usersCtrl' });
})

.controller('usersCtrl', function ($scope, $q, userService) { 
	userService.get()
		.success(function(data){
			$scope.users = data;
		});	

	$scope.save = function (account) {
		userService.save(account);
	};

	$scope.resetPassword = function(id) {		
		userService.resetPassword(id)
			.success(function(data) {
				$scope.message = "The password has been changed";
			})
			.error(function(data, status) {
				$scope.message = "["+ status + "] failed to reset the password"; 
			});		
	};
})

.service('userService', ['$http', 'baseUrl', function($http, baseUrl){
	this.currentUser = {};
	return {
		get : function() {
			return $http.get(baseUrl + "/accountadmin/users");
		},
		save : function(user) {
			return $http.put(baseUrl + "/accountadmin/users", user);
		},
		resetPassword : function(id) {
			return $http.post(baseUrl + '/accountadmin/users/' + id + '/resetpassword');
		}
	};
}]);