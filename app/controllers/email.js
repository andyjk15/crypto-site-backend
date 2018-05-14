//Using SendGrid's v3 Node.js Library
// // https://github.com/sendgrid/sendgrid-nodejs
var sgMail = require('@sendgrid/mail');
require('dotenv').config({
	path: '../../config/sendgrid.env'
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.email = function(email_list, body, message) {
	//for each in email_list
	//var email = {
	//to: email_list[i],
	//from: 'noreply@crypto-site.com',
	//subject: body,
	//test: message,
	//html: ??,
	//}
	//sgMail.send(email);
	var msgtest = {
		to: 'andrew.sotheran@googlemail.com',
		from: 'noreply@crypto-site.com',
		subject: 'Sending with SendGrid is Fun',
		text: 'and easy to do anywhere, even with Node.js',
		html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	};

	sgMail.send(msgtest);
};
