angular.module('rvAdminApp.company.uploads', ['ngRoute', 'config'])

.config(function ($provide, $routeProvider) {
	$routeProvider
		.when('/company/uploads/uploadfile', { templateUrl: 'company/uploads/uploadfile.tpl.html', controller: 'uploadController' });
})

.controller('uploadController', ['$scope', '$location', 'uploadService','$upload','$http',  function($scope, $location, uploadService,$upload, $http){		
	$scope.onFileSelect = function($files) {		
		var file = $files[0];

		uploadService.upload(file).then(function(data){
			console.log(data);
			$location.path('/company/uploads');
		});
	};	
}])

.factory('uploadService', ['$http','baseUrl','$q','$window', function($http, baseUrl, $q, $window)
{
	function getPresignedUrl(file) {
		return $http.get('https://devapi.to-increase.com/ti_rapidvalue/api' + '/uploads/getpresignedurl', { headers: { 'x-content-type' : file.type}});
	}

	function uploadCompleted(data) {			
		return $http.post(baseUrl + '/uploads', data);
	}

	return{		
		upload : function(fileToUpload) {
			var d = new $q.defer();			
			getPresignedUrl(fileToUpload).success(function(data){
				var xhr = new $window.XMLHttpRequest();

				xhr.addEventListener("load", function(event) { 
					uploadCompleted(data).success(function(data){
						d.resolve(data);
					});
				} , false);
				
				xhr.addEventListener("error", function(event) {d.reject(event);} , false);
				
				xhr.addEventListener("abort", function(event) {d.reject(event);}, false);			

				xhr.upload.addEventListener('progress', function(event) {
					// handle the progress here
				}, false);

				xhr.open('PUT', data.PresignedUrl, true);
				
				xhr.send(fileToUpload);
			});
			return d.promise;
		}
	};
}]);

