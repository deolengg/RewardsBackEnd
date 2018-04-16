'use strict';

var mongoose = require('mongoose');
var Services = require('../model/serviceModel');

exports.listServices = function (req, res) {
    console.log("List Services Method Called");
    Services.find({}, function (err, service) {
        if (err)
            res.send(err);
        res.json(service);
    });
};

exports.addService = function (req, res) {

    var service = new Services(req.body);

    service.save(function (err, service) {
        if (err)
            res.send(err);
        else {
            res.status(200).send({'Service Added ' :req.body.name });
        }
    });
};