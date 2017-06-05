"use strict";

(function() {

	var _tenderNumber = function(tenderNumber) {
		var self = {};
	    self.request_hash	= tenderNumber && tenderNumber.request_hash ? tenderNumber.request_hash : '';
	    self.tenders 		= tenderNumber && tenderNumber.tenders 		? tenderNumber.tenders 		: [];

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
	module.exports = _tenderNumber;

})();