describe('rvAdminApp.uploads', function(){
	describe('controller tests', function() {
		var mockUploadService = {};
		var scope, $location; 
		
		var response = {
			preSignedUrl : "http://to-increase.com", 
			S3BucketName : "my s3 S3BucketName", 
			S3Key : "my S3Key",
			Domain : "my domain"
		};
		
		beforeEach(module('rvAdminApp.company', function($provide){
			$provide.value('uploadService', mockUploadService);
		}));

		beforeEach(inject(function($q,$http,$httpBackend) {				
				mockUploadService.listUploads = function() {					
					return $http.get("http://localhost/rapidvalue/api/uploads");
				};
				mockUploadService.upload = function(file) {
					var d = new $q.defer();
					d.resolve(response);
					return d.promise;
				};
								
		}));

		beforeEach(inject(function($controller, $rootScope, _$location_, _uploadService_){
			scope = $rootScope.$new();
			var uploadService = _uploadService_;
			$location = _$location_;
			$controller('uploadController', {
				$scope : scope, 
				uploadService : uploadService
			});	
		}));

		it('should redirect us to the company uploads list page', inject(function($httpBackend){
			$httpBackend.when('PUT', response.preSignedUrl).respond(200, response);
			$httpBackend.when("GET","http://localhost/rapidvalue/api/uploads").respond(200);
			spyOn($location, 'path');

			var  files = { files: [{ type : "application/xml" , name : "testfile.xml", size : "10"}]};

			scope.onFileSelect(files);
			scope.uploadFile();

			scope.$digest();
			
			//expect($location.path).toHaveBeenCalledWith('/company/uploads');
		}));

	});

	describe('service test', function() {
		var svc, baseUrl;
		var $httpBackend;
		var file = {type : "application/xml"};

		beforeEach(module('rvAdminApp.company'));
		beforeEach(inject(function ($injector) {
			svc = $injector.get('uploadService');
		}));

		beforeEach(angular.mock.inject(function (_baseUrlRapidValue_,_$httpBackend_) {			
			baseUrl = _baseUrlRapidValue_;						
			$httpBackend = _$httpBackend_;
			var response = {
				preSignedUrl : "http://to-increase.com", 
				S3BucketName : "my s3 S3BucketName", 
				S3Key : "my S3Key",
				Domain : "my domain"
			};
			
			$httpBackend.expectGET(baseUrl + "/uploads/getpresignedurl",undefined, function(headers){  
				return headers['x-content-type'] === file.type ;
			}).respond(200, response);
		}));
		

		it('XMLHttpRequest is configured properly', inject(function($httpBackend, $window,$rootScope) {
			// arrange
			var scope = $rootScope.$new();
			var file = {};
			$window.XMLHttpRequest= angular.noop;
			addEventListenerSpy = jasmine.createSpy("addEventListener");
			openSpy = jasmine.createSpy("open");
			sendSpy = jasmine.createSpy("send");
			xhrObj = {
				upload: 
					{
						addEventListener: addEventListenerSpy
					},
					addEventListener: addEventListenerSpy,
					open: openSpy,
					send: sendSpy
				};

			spyOn($window, "XMLHttpRequest").andReturn(xhrObj);	

			// act
			var promise = svc.upload(scope, file);
			$httpBackend.flush();
			expect(xhrObj.open).toHaveBeenCalled();
			expect(xhrObj.send).toHaveBeenCalled();
	
			promise.then(function(data){
				expect(data).toBe(response);
			});			


		}));			
	});
});