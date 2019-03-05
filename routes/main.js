const express = require('express')
const getServiceHealth = require('../middleware/getServiceHealth')

module.exports = express.Router()
    .get('/health/:service', getServiceHealth)
