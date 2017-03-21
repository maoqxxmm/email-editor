var fs = require('fs');
var Velocity = require('velocityjs');
var path = require('path');
var settings = require('../configs/settings')
var mockMail = require('../mock/mail')
var config = require('../configs/config')
var maillist = require('../configs/maillist')

module.exports = function (app) {
	var route2Page = {
		giftcode: 'gift_code_body',
		renew: 'renew_body',
		resetpassword: 'reset_Password_body',
		shareproject: 'share_project_body',
		signup: 'signup_body',
		usersurvey: 'user_survey_3_body',
		verifyemail: 'verify_email_body'
	}

	var compileHtml = function (pageName, data) {
		var filePath = path.resolve('./build/', pageName.concat('.html'))
		var layoutHtml = fs.readFileSync(filePath).toString();
	  var Compile = Velocity.Compile;
	  var asts = Velocity.parse(layoutHtml);
	  var s = (new Compile(asts)).render(data);
	  return s;
	}

	app.get(['/mail/:page', '/mail/:page/:lang'], function (req, res, next) {
		var lang = req.params.lang
		var page = req.params.page
		var suffix = lang && /zh/.test(lang) ? '_zh_CN' : ''
		console.log(route2Page[page] + suffix)
		res.send(compileHtml(route2Page[page] + suffix, Object.assign({}, settings, mockMail[page])))
	})

	app.get('/send', function (req, res, next) {
		res.render('sender', {
			pages: route2Page,
			maillist: maillist
		})
	})

	app.post('/send', function (req, res, next) {
		var body = req.body
		var page = route2Page[body.mail]
		var data = Object.assign({}, settings, mockMail[body.mail])
		var lang = body.lang === 'en' ? '' : '_zh_CN'
		
		app.smtpTransport.sendMail({
			from: config.mail.user, // sender address
			to: body.receiver, // list of receivers
			subject: compileHtml(page + '_title' + lang, data), // Subject line
			html: compileHtml(page + lang, data) // html body
		}, function (err) {
			if (err) {
				return res.send('Error')
			}
			res.redirect('/send')
		})
	})
}