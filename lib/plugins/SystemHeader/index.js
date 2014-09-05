var log = require('log4js').getLogger('SystemHeader');

function SystemHeader(config) {
	var __config = config;
	
	return function(request, response) {
		log.trace('reached middleware.');
		
		var deferred = require('q').defer();
		
		response.setHeader('X-Forwarded', __config.name);
		
		deferred.resolve();
		return deferred.promise;
	}
};

module.exports = SystemHeader;