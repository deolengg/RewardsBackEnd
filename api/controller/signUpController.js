'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');

var Users = require('../model/signUpModel');
var Question = require('../model/questionModel');
var Service = require('../model/serviceModel');

var needle = require('needle');


exports.linkedinLogin = function (req, res) {
    let code = req.query.code;
    console.log(code);
    needle('post', 'https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3001/login/linkedin',
        client_id: 'Your Client ID',
        client_secret: 'Your Client Secret Key'
    })
        .then(function (resp) {
            let resp_body = resp.body;
            if (resp_body.error) {
                return res.status(400).send(resp_body);
            }
            // Save access token in db
            return getProfileFromLinkedIn(resp_body.access_token).then(profile => {
                // save profile info in db
                Users.find({ "email" : profile.emailAddress }, (err, user) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if (user.length == 0) {
                        user = new Users({ email: profile.emailAddress, verification: true });
                    } else {
                        user = user[0];
                    }
                    user.first_name = profile.firstName;
                    user.last_name = profile.lastName;
                    user.save();
                
                    res.send(profile);// to be removed later on
                });
            });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).send(err);
        });
}

function getProfileFromLinkedIn(token) {
    return needle('get', 'https://api.linkedin.com/v1/people/~:(id,picture-url,first-name,last-name,email-address,location)', { format: 'json' }, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }).then((resp) => {
        console.log(resp.body);
        return resp.body;
    });
}

exports.facebookLogin = function (req, res) {
    let code = req.query.code;
    console.log(code);
    needle.request('get', 'https://graph.facebook.com/v2.12/oauth/access_token', {
        client_id: 'Your Client ID',
        redirect_uri: 'http://localhost:3001/login/facebook',
        client_secret: 'Your Client Secret Key',
        code: code
    }, function (err, resp) {
        if (err) {
            console.log(err);
            return res.status(400).send(resp_body);
        }
        let resp_body = resp.body;
        if (resp_body.error) {
            return res.status(400).send(resp_body);
        }
        console.log(resp_body);
        let token = resp_body.access_token;
        // Save access token in db
        return getProfileFromFacebook(resp_body.access_token).then(profile => {
            // save profile info in db
            Users.find({ "email": profile.email }, (err, user) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (user.length == 0) {
                    user = new Users({ email: profile.email, verification: true });
                } else {
                    user = user[0];
                }
                user.first_name = profile.first_name;
                user.last_name = profile.last_name;
                user.save();



                res.send(profile);//to be removed later on
            });

        });
    });
}
function getProfileFromFacebook(token) {
    return needle('get', 'https://graph.facebook.com/v2.12/me?fields=id,first_name,last_name,email,location', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }).then((resp) => {
        console.log(resp.body);
        return resp.body;
    });
}

