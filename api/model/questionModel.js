'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questions = new Schema({
    id : { type : String, required : true },
    type : String,
    format : String,
    multiple : { type : Boolean, default : false},
    options : [],
});
module.exports = mongoose.model('Questions', questions);