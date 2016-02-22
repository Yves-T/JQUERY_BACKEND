var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/app2', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* Handle form */
router.post('/app2/userForm', function (req, res, next) {
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
