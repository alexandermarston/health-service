const express = require('express');
const expressBoom = require('express-boom');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mainRouter = require('./routes/main')
const logger = require('./lib/logger');

// Set Express Port
const port = 3000 | process.env.PORT

// Initialise express
const app = express()

// Boom response objects in Express.
app.use(expressBoom());

// Parse incoming bodies
app.use(bodyParser.json());

// Use the Express Validator module
app.use(expressValidator());

// Use the Main Router
app.use('/', mainRouter);

// Handle any missing resources
app.use(function (req, res, next) {
    res.boom.notFound('The specified resource was not found')
})

// Handle any stacktraces
app.use(function (err, req, res, next) {
    console.error(err.stack)
    const { output } = Boom.boomify(err);
    return res.status(output.statusCode).json(output.payload);
})

// Listen on specified port
app.listen(port, () => {
    logger.info('Application listening on port ' + port)
});
