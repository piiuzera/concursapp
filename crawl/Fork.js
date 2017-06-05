"use strict";

var Cluster	= require('cluster');
var Log 	= require('./fork/Log');

(function() {
	var _listCandidate     = [];
    var _listTenderNumber  = [];
    var _workers           = [];
    var _scaleLoop         = {};
    var _scaleLoopMs       = 100;

	var _getListCandidate = function() {
		var _enqueue = function(candidate) {
			if (!candidate || !candidate.Get('cpf') || !candidate.Get('tender_number') || !candidate.Get('request_hash')) {
				return;
			}

			_listCandidate.unshift(candidate);
		};

		var _dequeue = function() {
			if (_listCandidate.length === 0) {
				return null;
			}

			return _listCandidate.pop();
		};

		return {
			Enqueue : _enqueue,
			Dequeue : _dequeue
		};
	};

    var _getListTenderNumber = function() {
        var _enqueue = function(tenderNumber) {
            if (!tenderNumber || !tenderNumber.Get('request_hash')) {
                return;
            }

            _listTenderNumber.unshift(tenderNumber);
        };

        var _dequeue = function() {
            if (_listTenderNumber.length === 0) {
                return null;
            }

            return _listTenderNumber.pop();
        };

        return {
            Enqueue : _enqueue,
            Dequeue : _dequeue
        };
    };

    var _setScale = function() {
        var workersId 	= Object.keys(_workers);
        var threads 	= 10;
        var resolution	= (_listCandidate.length + _listTenderNumber.length) / threads;
        var newThreads	= 0;

        if (threads > workersId.length) {
            newThreads = threads - workersId.length;

            if (resolution < 1) {
                newThreads = (_listCandidate.length + _listTenderNumber.length) - workersId.length;
            }

            _startWorkers(newThreads);
            return;
        }
    };

    var _startWorkers = function(quantity) {
        for (var i = 0; i < quantity; i++) {
            var worker = Cluster.fork();

            _workers[worker.id] = worker;
        }
    };

	var _init = function() {
        Cluster.setupMaster({
            exec: './crawl/Worker.js',
            args: ['--use', 'http']
        });

        _setScale();
        _scaleLoop = setInterval(_setScale, _scaleLoopMs);
	};

	module.exports.GetListCandidate    = _getListCandidate;
    module.exports.GetListTenderNumber = _getListTenderNumber;
	module.exports.Init 			   = _init;
})();