var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('./../config.json')[process.env.NODE_ENV || 'dev'];

/* GET home page. */
router.get('/' + config.api.urlPrefix, function (req, res, next) {
    res.render('index', {title: 'Backend jQuery eindwerk'});
});

/* Handle form */
router.post('/' + config.api.urlPrefix + 'userForm', function (req, res, next) {
    var email = req.body.email;

    sendEmail(email).then(() => {
        sendJsonResponse(res, 200, "OK");
    }).catch(err => {
        sendJsonResponse(res, 400, {
            "message": "Fout bij het verzenden van mail" + err
        });
    });
});


function sendEmail(email) {
    var transportUri = 'smtps://' + process.env.GOOGLE_USER + ':' + process.env.GOOGLE_PASSWORD + '@smtp.gmail.com';
    var transporter = nodemailer.createTransport(transportUri);
    return new Promise((resolve, reject) => {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Yves Talboom"' + process.env.GOOGLE_USER, // sender address
            to: email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world 🐴', // plaintext body
            html: '<b>Hello world 🐴</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return reject(error)
            }
            return resolve('Message sent: ' + info.response);
        });

    });
}

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports = router;
