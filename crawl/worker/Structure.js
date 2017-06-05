"use strict";

(function() {
	var _baseUrl   = 'http://www2.copasa.com.br/'; 
	var _urlIndex  = _baseUrl + 'servicos/Portaltransparencia/Concurso/ConsultaConcurso.asp';
	var _urlResult = _baseUrl + 'servicos/Portaltransparencia/Concurso/ConcursoPorCPF.asp?NCPF=';

	module.exports.BaseUrl		= _baseUrl;
	module.exports.UrlIndex		= _urlIndex;
	module.exports.UrlResult	= _urlResult;
})();