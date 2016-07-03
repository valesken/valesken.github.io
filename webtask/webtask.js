var Express = require('express');
var request = require('request');
var wt = require('webtask-tools');

var app = new Express();
var router = Express.Router();

app.use(router);

const RESPONSE = {
  OK : {
    statusCode : 200,
    message: 'Email sent successfully!'
  },
  ERROR : {
    statusCode: 500,
    message: 'Something went terribly, horribly, disastrously wrong!'
  }
}

router.post('/', function (req, res) {
    // Get secrets
    var POSTMARK_SERVER_KEY = req.webtaskContext.secrets.POSTMARK_SERVER_KEY;
    var FROM_EMAIL = req.webtaskContext.secrets.FROM_EMAIL;
    var TO_EMAIL = req.webtaskContext.secrets.TO_EMAIL;

    // Get email information
    var subject = '[Website Contact]';
    if (req.webtaskContext.data.subject.length > 0) {
        subject = subject + ' ' + req.webtaskContext.data.subject;
    } else {
        subject = subject + ' No Subject';
    }
    var replyTo = req.webtaskContext.data.replyTo; // TODO: validate replyTo email
    var textBody = req.webtaskContext.data.textBody;

    request({
        url: 'https://api.postmarkapp.com/email',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Postmark-Server-Token': POSTMARK_SERVER_KEY
        },
        json: {
            'From': FROM_EMAIL,
            'To': TO_EMAIL,
            'Subject': subject,
            'TextBody': textBody,
            'ReplyTo': replyTo
        }
    }, function(error, response, body) {
        if (!error) {
            res.writeHead(RESPONSE.OK.statusCode, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(RESPONSE.OK));
        } else {
            res.writeHead(RESPONSE.ERROR.statusCode, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(RESPONSE.ERROR));
        }
    });
});

module.exports = wt.fromExpress(app);