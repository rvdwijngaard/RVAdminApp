angular.module('rvAdminApp.company.uploads', ['ngRoute', 'config'])

.controller('uploadController', function(){

})

.factory('uploadService', ['$http','baseUrl','$q', function($http, baseUrl, $q)
{
	return{ 
		getPresignedUrl : function(fileToUpload) {	
			var d = new $q.defer();	

			$http.get(baseUrl + '/uploads/getpresignedurl', { headers: { 'x-content-type' : fileToUpload.type}})
				.success(function (signedUrl) {
					signedUrl = signedUrl.substring(1, signedUrl.length - 1);
					d.resolve(signedUrl);
				});
			return d.promise;
		},	
		upload : function(fileToUpload, preSignedUrl) {
			var d = new $q.defer();
			var xhr = new XMLHttpRequest();

			xhr.onerror = function (e) {};

			xhr.onreadystatechange = function () {};

			xhr.open('PUT', preSignedUrl, true);
			
			return d.promise;
		}
	};
}]);

