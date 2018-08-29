const express = require('express');
const bodyParser = require('body-parser');
const wt = require('webtask-tools');
const nodemailer = require('nodemailer');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);

const RESPONSE = {
  OK: {
    statusCode: 200,
    message: 'Email sent successfully!'
  },
  ERROR: {
    statusCode: 500,
    message: 'Something went terribly, horribly, disastrously wrong!'
  }
};

router.post('/', function (req, res) {
  // Get secrets
  const GMAIL_USER = req.webtaskContext.secrets.GMAIL_USER;
  const GMAIL_PASSWORD = req.webtaskContext.secrets.GMAIL_PASSWORD;

  // Get email information
  let subject = '[Website Contact]';
  if (req.body.subject.length > 0) {
    subject = subject + ' ' + req.body.subject;
  } else {
    subject = subject + ' No Subject';
  }
  const replyTo = req.body.replyTo; // TODO: validate replyTo email
  const textBody = req.body.textBody;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: replyTo,
    to: GMAIL_USER,
    subject: subject,
    text: textBody
  };
  transporter.sendMail(mailOptions, function (error) {
    const result = error ? RESPONSE.ERROR : RESPONSE.OK;
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
  });
});

module.exports = wt.fromExpress(app);