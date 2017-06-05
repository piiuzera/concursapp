"use strict";

(function() {

	var _candidate = function(candidate) {
		var self = {};
		self.cpf 						= candidate && candidate.cpf 						? candidate.cpf 						: '';
		self.name 						= candidate && candidate.name 						? candidate.name 						: '';
	    self.registration_number 		= candidate && candidate.registration_number 		? candidate.registration_number 		: '';
	    self.tender_number 				= candidate && candidate.tender_number 				? candidate.tender_number 				: '';
	    self.specialty 					= candidate && candidate.specialty 					? candidate.specialty 					: ''; 
	    self.region 					= candidate && candidate.region 					? candidate.region 						: '';
	    self.classification 			= candidate && candidate.classification 			? candidate.classification 				: 0;
	    self.summoned 					= candidate && candidate.summoned 					? candidate.summoned 					: 0;
	    self.quantity_for_your_summoned = candidate && candidate.quantity_for_your_summoned ? candidate.quantity_for_your_summoned 	: 0;
	    self.request_hash 				= candidate && candidate.request_hash 				? candidate.request_hash 				: '';

	    var _toJson = function() {
	    	return JSON.parse(JSON.stringify(self));
	    };

	    var _get = function(key) {
	    	return self[key];
	    };

	    var _set = function(key, value) {
	    	self[key] = value;
	    };

	    this.ToJson = _toJson;
	    this.Get 	= _get;
	    this.Set 	= _set;
	};

	module.exports = _candidate;

})();