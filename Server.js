"use strict";

var BodyParser      = require('body-parser');
var Candidate 		= require('./models/Candidate');
var CookieParser    = require('cookie-parser');
var Cors            = require('cors');
var EJS             = require('ejs');
var Express         = require('express');
var Index 			= require('./Index');
var Path            = require('path');
var RouterCopasa 	= require('./router/RouterCopasa');

(function() {
	var _init = function() {
		var App = Express();

		App.engine('html', EJS.renderFile);

		App.use(BodyParser.urlencoded({
			extended: true
		}));
		App.use(BodyParser.json());
		App.use(CookieParser());
		App.use(Cors());
		App.use(Express.static(Path.join(__dirname, 'public_html')));

		App.use('/crawler/copasa/', RouterCopasa.GetRouter());

		App.listen(5006, function() {
			console.log("Server has Started: http://localhost:5006");

			Index.Init();
		});
	};

	module.exports.Init = _init;
})();

this.Init();