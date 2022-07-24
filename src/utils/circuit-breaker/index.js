const CircuitBreaker = require('opossum');
const { circuitBreakerOptions } = require('../../../config');

const options = {
  ...circuitBreakerOptions,
  errorFilter: err => ((!err || !err.code)
    ? false // open circuit breaker
    : (err.code >= 300 && err.code < 500)), // not open circuit breaker if (300 <= httpCode < 500)
};

module.exports = {
  breaker: asyncFunc => new CircuitBreaker(asyncFunc, options),
};
