angular.module('rvAdminApp.company.uploads', ['ngRoute', 'config', 'ngProgress'])
/* jshint -W024 */
.config(function ($provide, $routeProvider) {
	$routeProvider
		.when('/company/uploads', { templateUrl: 'company/uploads/uploads.tpl.html', controller: 'uploadController' });
	$routeProvider
		.when('/company/uploads/uploadfile', { templateUrl: 'company/uploads/uploadfile.tpl.html', controller: 'uploadController' });
})

.controller('uploadController', ['$scope', '$location', 'uploadService', 'ngProgress', function($scope, $location, uploadService, ngProgress){
	function load() {
		uploadService.listUploads()
			.success(function(data){
				$scope.uploads = data;
			});				
	}	
	load();

	$scope.deleteItem = function(id){
		uploadService.deleteItem(id).success(function() {
			load();
		});
	};

	$scope.onFileSelect = function (element) {
		$scope.$apply(function () {
			$scope.fileToUpload = element.files[0];
		});
	};

	$scope.uploadFile = function() {		
		var file = $scope.fileToUpload;

		uploadService.upload($scope, file).then(function(data){						
			$scope.message = "Solution succesfully uploaded";
			ngProgress.complete();
			load();
		});

		$scope.$on("uploadProgress", function(e, progress) {
			ngProgress.set((progress.loaded / progress.total) * 100);
		});
	};	
}])

.factory('uploadService', ['$http','baseUrlRapidValue','$q','$window','companyService', function($http, baseUrlRapidValue, $q, $window, companyService)
{	
	function getPresignedUrl(file) {
		//'https://devapi.to-increase.com/ti_rapidvalue/api'
		return $http.get(baseUrlRapidValue + '/uploads/getpresignedurl', { headers: { 'x-content-type' : file.type}});
	}

	function postUpload(data, file) {			
		var d = new $q.defer();
		companyService.get().success(function(company) {
			data.apikey = company.ApiToken;
			data.FileName = file.name;
			$http.post(baseUrlRapidValue + '/uploads', data)
				.success(function(data){
					d.resolve(data);
				})
				.error(function(data, status){
					d.reject(status);
				});
			})
			.error(function(data, status){
				d.reject(status);
			});

		
		return d.promise;
	}
	
	function onError(result, deferred, scope) {
		return function () {
                scope.$apply(function () {
                    deferred.reject(result);
                });
            };
	}

	function onProgress(scope)
	{
		return function (event) {
			scope.$broadcast("uploadProgress",
			{
				total: event.total,
				loaded: event.loaded
			});
		};
	}
	
	return{		
		upload : function(scope, fileToUpload) {
			var d = new $q.defer();			
			getPresignedUrl(fileToUpload).success(function(data){
				var xhr = new $window.XMLHttpRequest();
				xhr.onload = function () {
					postUpload(data, fileToUpload).then(function(data){
						d.resolve(data);
					});	
				};
				
				xhr.onerror = onError(data, d, scope);							

				xhr.upload.onprogress = onProgress(scope);

				xhr.open('PUT', data.PresignedUrl, true);
				
				xhr.send(fileToUpload);
			});
			return d.promise;
		},
		listUploads : function () {
			return $http.get(baseUrlRapidValue + '/uploads');
		},
		
		deleteItem : function(id) {
			return $http.delete(baseUrlRapidValue + '/uploads/' + id);
		}	
	};
}]);

