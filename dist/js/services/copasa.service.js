angular.module('Concursapp')
	.service('Copasa', ['$http', 'Web',
		function($http, Web) {

		var _tenders = function(callback) {
			Web.Get(
				'/crawler/copasa/tenders',
				callback
			);
		};

		var _candidate = function(candidate, callback) {
			Web.Post(
				'/crawler/copasa/candidate',
				candidate,
				callback
			);
		};

		return {
			Tenders 	: _tenders,
			Candidate 	: _candidate
		};
}]);