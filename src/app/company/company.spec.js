describe( 'copmany  section', function() {
	var svc, url, backend;
	var $location;

	beforeEach( module('rvAdminApp.company'));
 
	beforeEach(inject(function ($injector, $httpBackend, baseUrl, _$location_) {
		backend = $httpBackend;
		svc = $injector.get('companyService');
		url = baseUrl;
		$location = _$location_;
	}));

	it( 'register should return an company object', inject( function() {
		// arrange
		var company = {
			name : "my test company", 
			email : "info@mycompany.com"
		};

		backend.when("POST", url + "/companyaccount").respond(200, company);

		// act
		var result = svc.register(company);
		backend.flush();

		// assert
		result.then(function(data) {
			expect(data).toBe(company);
		});
		
	}));

	it('register should change the location to the root', function() {
		

	});
});

