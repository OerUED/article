'use strict';

module.exports = function(app) {
  app.use('/uc', require('./uc'));
};
