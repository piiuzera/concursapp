"use strict";

var Cheerio 	= require('cheerio');
var Log 		= require('./worker/Log');
var Structure 	= require('./worker/Structure');
var Web 		= require('./worker/Web');

(function() {

	var _isReady 			= true;
	var _startCrawlLoop 	= {};
	var _startCrawlLoopMs 	= 100;
	var _candidate 			= null;
	var _tenderNumber 		= null;

	var handleMessage = function(message) {
		if (!message.command) {
			return;
		}

		if (message.command === 'SetCandidate') {

			_setCandidate(message.data.candidate);

		} else if (message.command === 'SetTenderNumber') {

			_setTenderNumber(message.data.tenderNumber);

		}
	};

	var _startCrawl = function() {
		if (!_isReady) {
			return;
		}

		if (!_tenderNumber) {
			_getTenderNumber();
		} else {
			_isReady = false;

			_getCrawlTenderNumber();

			return;
		}

		if (!_candidate) {
			_getCandidate();
		} else {
			_isReady = false;

			_getCrawlCandidate();

			return;
		}
	};

	var _getCandidate = function() {
		process.send({
			command : 'GetCandidate'
		});
	};

	var _setCandidate = function(candidate) {
		if (!candidate || !candidate.cpf || !candidate.tender_number || !candidate.request_hash) {
			return;
		}

		_candidate = candidate;
	};

	var _getTenderNumber = function() {
		process.send({
			command	: 'GetTenderNumber'
		});
	};

	var _setTenderNumber = function(tenderNumber) {
		if (!tenderNumber || !tenderNumber.request_hash) {
			return;
		}

		_tenderNumber = tenderNumber;
	};

	var _getCrawlTenderNumber = function() {
		Log.Info('SEARCH TENDER NUMBER STARTED');

		Web.Get(
			Structure.UrlIndex,
			SetCrawlTenderNumber
		);
	};

	var SetCrawlTenderNumber = function(body, status) {
		if (status !== 200 || !body) {
			Log.Error('SEARCH TENDER NUMBER HAS ERROR');

			SendTenderNumber();

			return;
		}

		var $ = Cheerio.load(body);

		$('#edital').find('option').each(function(index) {
			if($(this).val().trim() != '') {
				_tenderNumber.tenders.push($(this).val());
			}
		});

		Log.Info('SEARCH TENDER NUMBER SUCCESS');

		SendTenderNumber();
	};

	var _getCrawlCandidate = function() {
		Log.Info('SEARCH CANDIDATE STARTED');

		var request = {
			visor 	: _candidate.cpf,
			senha 	: _candidate.cpf,
			edital 	: _candidate.tender_number
		};

		Web.Post(
			Structure.UrlResult + _candidate.cpf,
			request,
			SetCrawlCandidate
		);
	};

	var SetCrawlCandidate = function(body, status) {
		if (status !== 200 || !body) {
			Log.Error('SEARCH CANDIDATE HAS ERROR');

			SendCandidate();

			return;
		}

		var $ = Cheerio.load(body);

		if($('table > tbody > tr').length > 5) {
			$('table > tbody > tr').each(function(index) {
				if(index == 2) {
					_candidate.name = $(this).find('td').first().contents().filter(function() {
						return this.type === 'text';
					}).text().trim();
				} else if(index == 3) {
					_candidate.registration_number = $(this).find('td').first().contents().filter(function() {
						return this.type === 'text';
					}).text().trim();
				} else if(index == 4) {
					_candidate.tender_number = $(this).find('td').first().contents().filter(function() {
						return this.type === 'text';
					}).text().trim();
				} else if(index == 5) {
					_candidate.specialty = $(this).find('td').first().contents().filter(function() {
						return this.type === 'text';
					}).text().trim();
				} else if(index == 6) {
					_candidate.region = $(this).find('td').first().contents().filter(function() {
						return this.type === 'text';
					}).text().trim();
				} else if(index == 7) {
					var classification = $(this).find('td').first().contents().filter(function() {
						return this.type === 'text';
					}).text().trim();

					_candidate.classification = isNaN(classification) ? 0 : Number(classification);
				} else if(index == 8) {
					var summoned = $(this).find('td').first().contents().filter(function() {
						return this.type === 'text';
					}).text().trim();

					_candidate.summoned = isNaN(summoned) ? 0 : _candidate.classification - (Number(summoned) + 1);
				}
			});
			_candidate.quantity_for_your_summoned = _candidate.classification > _candidate.summoned ? _candidate.classification - _candidate.summoned : 0;

			var comments = $.root().find('*').contents().filter(function() {
				return this.type === 'comment';
			});

			Log.Info('SEARCH CANDIDATE SUCCESS');
		} else {
			Log.Error('SEARCH CANDIDATE HAS ERROR');
		}

		SendCandidate();
	};

	var SendTenderNumber = function() {
		process.send({
			command	: 'SetTenderNumber',
			data 	: {
				tenderNumber 	: _tenderNumber
			}
		});

		_tenderNumber = null;
		_isReady = true;
	};

	var SendCandidate = function() {
		process.send({
			command	: 'SetCandidate',
			data 	: {
				candidate 	: _candidate
			}
		});

		_candidate = null;
		_isReady = true;
	};

	var _init = function() {
		process.on('message', handleMessage);

		_startCrawl();
		_startCrawlLoop = setInterval(_startCrawl, _startCrawlLoopMs);
	};

	module.exports.Init = _init;
})();

this.Init();