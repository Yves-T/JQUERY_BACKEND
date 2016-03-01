var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var faker = require('faker');
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

// handle fake persons
router.get("/" + config.api.urlPrefix + "person", function (req, res) {

    var response = [];
    var i = 4;
    while (i--) {
        response.push(createRandomUser());
    }

    res.json(response);
});

function createRandomUser() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        lorem: faker.lorem.sentence(),
        image: faker.image.avatar()
    };
}

function sendEmail(email) {
    var transportUri = 'smtps://' + process.env.GOOGLE_USER + ':' + process.env.GOOGLE_PASSWORD + '@smtp.gmail.com';
    var transporter = nodemailer.createTransport(transportUri);
    return new Promise((resolve, reject) => {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Yves Talboom"' + process.env.GOOGLE_USER, // sender address
            to: email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Thanks for contacting us 🐴', // plaintext body
            html: '<b>Hello 🐴</b><p>Thanks for contacting us. Currently I am on vacation' +
            ' (Recovering from jQuery course ).Hoping to win the lottery and never return</p>' // html body
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
