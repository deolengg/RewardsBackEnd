'use strict';

var mongoose = require('mongoose');
var Questions = require('../model/questionModel');
var Service = require('../model/serviceModel');

//list all questions
exports.listQuestions = function (req, res) {
    Questions.find({}, function (err, questions) {
        if (err)
            res.send(err);
        res.json(questions);
    });
};
//add question
exports.addQuestion = function (req, res) {
    var question = new Questions(req.body);

    question.save(function (err, question) {
        if (err)
            res.send(err)
        else {
            res.status(202).send({ Success: 'Question Accepted and Added' });
        }
    });
};

//return questions using service type
exports.provideQuestionairePerService = function (req, res) {
    console.log("Service called ......");
    let service = req.params.service;
    console.log(req.params.service);

    Service.find({ name: service }, (err, service) => {
        if (err) { console.log(err); throw err; }
        if (service.length == 1) {
            service = service[0];
            if (service.available == false) return res.status(401).send({ Error : 'Service Not Available' });

            //console.log("This Service is Available");
            //console.log(typeof service.questions); 

            let questionsPromises = [];
            service.questions.forEach(question => {
                questionsPromises.push(Questions.findOne({ id: question }));
            });

            Promise.all(questionsPromises).then(questions => {
                res.send(questions.map(ques => {
                    return (({ id, type, format, multiple, options }) =>
                        ({ id, type, format, multiple, options }))(ques);
                }));
            })
        }
        else {
            //console.log("Service Called : "+serviceName+" is Invalid");
            return res.status(404).send({ Error : 'Service Not Found' });
        }
    });
};