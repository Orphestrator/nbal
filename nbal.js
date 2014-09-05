/**
 * nbal main file
 */
var log = require('log4js').getLogger('NBAL');
var yargs = require('yargs');

var args = yargs
	.usage('npm start [--config [PATH_TO_CONFIG]]')
	.options('c', {
		alias: 'config',
		default: './config'
	})
	.argv;

log.info('Starting NBAL');
var config = require(args.config);

var nodeBalancer = require(__dirname + '/lib/NodeBalancer')(config.server);

nodeBalancer.use(require('./lib/plugins').SystemHeader(config.identity));

nodeBalancer.start();
