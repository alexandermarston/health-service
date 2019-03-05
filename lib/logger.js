const winston = require('winston');
const pkg = require('../package.json');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
    defaultMeta: {
        service: pkg.name,
        version: pkg.version
    }
});

logger.add(new winston.transports.Console({
    format: winston.format.json()
}));

module.exports = logger
