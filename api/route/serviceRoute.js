'use strict';

module.exports = function (app) {
    var services = require('../controller/serviceController');
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    app.route('/api/service')
    .post(services.addService)
    .get(services.listServices);
   
};