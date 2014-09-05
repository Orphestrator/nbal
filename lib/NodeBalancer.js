var log = require('log4js').getLogger('NodeBalancer');
var http = require('http');
var _ = require('lodash');
var q = require('q');

NodeBalancer = function(config) {
	log.trace('Constructing NodeBalancer');
	
	var __config = config;
	var __server = null;
	var __middleWares = [];
	
	function requestHandler(request, response) {
		log.trace('Request handler.');
		var deferred = q(request, response);
		var middleWareDeferreds = [];
		
		_.forEach(__middleWares, function(middleWare) {
			middleWareDeferreds.push(middleWare(request, response));
		})
		
		deferred
			.all(middleWareDeferreds)
			.then(function() {
				log.info('Successful passed all middlewares.');
				response.end();		
			})
			.fail(function(error) {
				log.fatal(error);
				response.end();
			});
		
	}
	
	function start() {
		log.trace('Starting');
		
		__server = http.createServer(requestHandler);
		__server.listen(__config.port);
	};
	
	function use(middleware) {
		__middleWares.push(middleware)
		
		log.trace('Middleware added.');
	}
	
	return {
		start: start,
		use: use
	};
}
module.exports = NodeBalancer;