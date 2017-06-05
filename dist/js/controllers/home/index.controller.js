angular.module('Concursapp')
	.controller('HomeIndexController', ['$scope', 'Copasa', 'Util',
		function($scope, Copasa, Util) {
			$scope.tenders 		= [];

			var _getTenders = function() {
				Copasa.Tenders(
					SetTenders
				);
			};

			var SetTenders = function(body, status) {
				if (!body || status > 399) {
					return;
				}

				$scope.tenders = body.tenderNumber.tenders;
			};

			var _getCandidate = function() {
				Copasa.Candidate(
					$scope.candidate,
					SetCandidate
				);
			};

			var SetCandidate = function(body, status) {
				if (!body || status > 399) {

					Util.GetNotify(
						body.message,
						'Problemas ao Consultar',
						Util.NotifyType.Error
					);

					return;
				}

				$scope.candidate = body.candidate;
			};

			var _init = function() {
				$scope.GetTenders();
			};

			$scope.GetTenders 	= _getTenders;
			$scope.GetCandidate = _getCandidate;
			$scope.Init 		= _init;
}]);