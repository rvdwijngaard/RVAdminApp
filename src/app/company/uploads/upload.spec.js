describe('rvAdminApp.uploads', function(){
	describe('service test', function() {
		var svc, baseUrl;

		beforeEach(module('rvAdminApp.company.uploads'));

		beforeEach(inject(function ($injector) {
			svc = $injector.get('uploadService');
		}));

		beforeEach(angular.mock.inject(function (_baseUrl_) {			
			baseUrl = _baseUrl_;			
		}));

		it('get presigned url should return a valid url without quotes', inject( function($httpBackend) {
			// arrange
			var file = {type : "application/xml"};
			var url = '"http://to-increase.com"';
			
			$httpBackend.expectGET(baseUrl + "/uploads/getpresignedurl",undefined, function(headers){  
				return headers['x-content-type'] === file.type ;
			}).respond(200, url);
			
			// act
			var promise = svc.getPresignedUrl(file);
			$httpBackend.flush();

			// assert
			promise.then(function(url){
				expect(url).toBe("http://to-increase.com");	
			});			
		}));
		
		it('message is posed after upload to s3', inject(function($httpBackend) {
			
		}));
		
	});
});