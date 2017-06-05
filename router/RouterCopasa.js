"use strict";

var Candidate 		= require('../models/Candidate');
var Express 		= require('express');
var Fork 			= require('../crawl/Fork');
var TenderNumber 	= require('../models/TenderNumber');
var Validator 		= require('validatorjs');

(function() {

	var Router 	 = Express.Router();
	var Requests = [];

	Router.get('/tenders', function(request, response) {
		var hash = Math.random().toString(16).slice(2);

		Requests.push({
			request 	: request,
			response 	: response,
			hash 		: hash
		});

		var tenderNumber = new TenderNumber();
		tenderNumber.Set('request_hash', hash);

		Fork.GetListTenderNumber().Enqueue(tenderNumber);
	});

	Router.post('/candidate', function(request, response) {
		var validation = new Validator(request.body, {
			cpf 		 : 'required',
			tender_number : 'required'
		});

		if (validation.fails()) {
			response.status(401).json({
				res: false,
				date: new Date(),
				message: 'Preencha todos os campos obrigatórios!',
				errors: validation.errors
			});

			return;
		}

		var hash = Math.random().toString(16).slice(2);

		Requests.push({
			request 	: request,
			response 	: response,
			hash 		: hash
		});

		var candidate = new Candidate(request.body);
		candidate.Set('request_hash', hash);

		Fork.GetListCandidate().Enqueue(candidate);
	});

	var _setTenders = function(tenderNumber) {
		var response = {};
		for (var i = 0; i < Requests.length; ++i) {
			if (Requests[i].hash === tenderNumber.request_hash) {
				response = Requests[i].response;
			}
		}

		if (!tenderNumber.tenders) {
			response.status(401).json({
				request 	 : false,
				date 		 : new Date(),
				message 	 : 'Nenhum edital foi encontrado!'
			});

			return;
		}

		response.status(200).json({
			request 	 : true,
			date 		 : new Date(),
			tenderNumber : tenderNumber
		});
	};

	var _setCandidate = function(candidate) {
		var response = {};
		for (var i = 0; i < Requests.length; ++i) {
			if (Requests[i].hash === candidate.request_hash) {
				response = Requests[i].response;
			}
		}

		if (!candidate.name) {
			response.status(401).json({
				request 	 : false,
				date 		 : new Date(),
				message 	 : 'Nenhum candidato foi encontrado!'
			});

			return;
		}

		response.status(200).json({
			request 	 : true,
			date 		 : new Date(),
			candidate 	 : candidate
		});
	};

	var _getRouter = function() {
		return Router;
	};

	module.exports.SetTenders 	= _setTenders;
	module.exports.SetCandidate = _setCandidate;
	module.exports.GetRouter 	= _getRouter;
})();