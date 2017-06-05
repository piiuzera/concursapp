"use strict";

var Cluster 		= require('cluster');
var Fork 			= require('./crawl/Fork');
var RouterCopasa	= require('./router/RouterCopasa');
var TenderNumber 	= require('./models/TenderNumber');

(function() {

	var handleMessage = function(worker, message) {
		if (!message.command) {
			return;
		}

		if (message.command === 'GetCandidate') {
			var candidate = Fork.GetListCandidate().Dequeue();

			worker.send({
				command: 'SetCandidate',
				data: {
					candidate: candidate ? candidate.ToJson() : null
				}
			});
		} else if (message.command === 'GetTenderNumber') {
			var tenderNumber = Fork.GetListTenderNumber().Dequeue();

			worker.send({
				command: 'SetTenderNumber',
				data: {
					tenderNumber: tenderNumber ? tenderNumber.ToJson() : null
				}
			});
		} else if (message.command === 'SetCandidate') {
			RouterCopasa.SetCandidate(message.data.candidate);
		} else if (message.command === 'SetTenderNumber') {
			RouterCopasa.SetTenders(message.data.tenderNumber);
		}
	};

	var _init = function() {
		Cluster.on('message', handleMessage);

		Fork.Init();
	};

	module.exports.Init = _init;
})();