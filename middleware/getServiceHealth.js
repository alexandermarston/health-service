const logger = require('../lib/logger');
const request = require('request-promise');
const consul = require('consul')({ host: process.env.CONSUL_DNS });

module.exports = async (req, res, next) => {
    logger.info('Health check request received for service: ' + req.params.service);

    try {
        // Check that the Authorisation Token is correct
        if (req.headers.authorization != 'hello') {
            logger.info('User was not authorised to make the request');
            return res.boom.unauthorized('The user is not authorized to make the request.');
        }

        consul.catalog.service.nodes(req.params.service, function(error, result) {
            if (error) return res.boom.badRequest("Unable to retrieve a list of services from Consul");

            if (result.length == 0) return res.boom.badRequest("The specified service was not found");

            request('http://' + result[0].name + ':' + result[0].port + '/health', function (error, response, body) {
                if (error) return res.boom.badRequest("Unable to retrieve health status from microservice");

                return res.status(response.statusCode).send(response.body);
            });
        });

    } catch (error) {
        console.log(error)
        return res.boom.badImplementation('The request failed due to an internal error.')
    }
}
