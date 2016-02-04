var express = require('express');
var router = express.Router();
var request = require('request');
var config = {secret: "oak"};

router.get('/', function(req, res) {
	res.render('index', { community: 'Pokebot',
		tokenRequired: !!config.secret });
});

router.post('/invite', function(req, res) {


		console.log(req);

	if (req.body.email && (!config.secret || (!!config.secret && req.body.token === config.secret))) {
		request.post({
			url: 'https://pokebot.slack.com/api/users.admin.invite',
			form: {
				email: req.body.email,
				token: process.env.INVITE_TOKEN,
				set_active: true
			}
		}, function(err, httpResponse, body) {
		//   {"ok":true} || {"ok":false,"error":"already_invited"}
		if (err) { return res.send('Error:' + err); }
		body = JSON.parse(body);
		if (body.ok) {
			res.render('result', {
				message: 'Success! Check "'+ req.body.email +'" for an invite from Slack.',
				isFailed: false
			});
		} else {
			var error = body.error;
			if (error === 'already_invited' || error === 'already_in_team') {
				res.render('result', {
					message: 'Success! You were already invited.<br>Visit <a href="https://pokebot.slack.com">pokebot.slack.com</a> to complete signup!',
					isFailed: false
				});
				return;
			} else if (error === 'invalid_email') {
				error = 'The email you entered is an invalid email.'
			} else if (error === 'invalid_auth') {
				error = 'Something has gone wrong.'
			}

			res.render('result', {
				message: 'Failed! ' + error,
				isFailed: true
			});
		}
	});
} else {
	var errMsg = [];
	if (!req.body.email) {
		errMsg.push('Email is required\n');
	}

	if (!!config.secret) {
		if (!req.body.token) {
			errMsg.push('Valid token is required\n');
		}

		if (req.body.token && req.body.token !== config.secret) {
			errMsg.push('The token you entered is incorrect\n');
		}
	}

	res.render('result', {
		message: 'Failed! ' + errMsg.join(' and ') + '.',
		isFailed: true
	});
}
});

module.exports = router;
