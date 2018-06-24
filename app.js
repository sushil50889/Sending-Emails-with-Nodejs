const express = require('express');
const keys = require('./config/keys_prod');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');

const app = express();

//port setup
const port = process.env.PORT || 5000;

//handlebars middleware
app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//static folder
app.use(express.static(`${__dirname}/public`));




//index route
app.get('/', (req, res) => {
  res.render('contact');
});




app.post('/sendmail', (req, res) => {
  const sentEmailTo = req.body.email;
  // console.log(sentEmailTo);
  const output = `
  <p>Thanks For Subscription Request</p>
  <h3>Contact</h3>
  <ul>
    <li>name : ${req.body.name}</li>
    <li>name : ${req.body.company}</li>
    <li>name : ${req.body.email}</li>
    <li>name : ${req.body.phone}</li>
  </ul>
  <h3>Contact Details</h3>
  <p>${req.body.message}</p>
  <br>
  <br>
  <br>
  <br>
  <p>Yours sincerely,</p>
  <p>Rocket Web Design</p>
  `;

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: keys.user, 
            pass: keys.pass
              },
        tls: {
          rejectUnauthorized: false
        }      
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Rocket Web Design" <mandi.sushil1990@gmail.com>`, // sender address
        to: sentEmailTo, // list of receivers
        subject: 'Hello, This Is a Test Mail', // Subject line
        text: 'Test Mail', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        var msg = `Well done! ${req.body.name}, Please Check Your Mail.`;
        res.render('contact', {msg: msg});
    });
});





app.listen(port, () => {
  console.log(`server is on...port : ${port}`);
});
