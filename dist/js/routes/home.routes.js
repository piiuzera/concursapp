angular.module('Concursapp').config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
}]);

angular.module('Concursapp').config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home/index.view.html',
			title: 'Concursapp | Amaro Corp',
			controller:  'HomeIndexController',
			authenticate: false
		})
		.otherwise({
			redirectTo: '/'
		});
}]);