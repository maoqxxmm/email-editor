var express = require('express');
var router = express.Router();

var route2Page = {
	renew: 'renew_body',
	resetpassword: 'reset_Password_body',
	setpassoword: 'set_Password_body',
	sharenote: 'sharenote_body',
	signup: 'signup_body',
	verifyemail: 'verify_email_body',
	shareproject: 'share_project_body'
}

var configs = {
	en: {
		product_name: 'DidaList',
		is_cn_site: 'false',
		site_domain: 'dida365.com',
		cdn_domain: '127.0.0.1'
	},
	zh: {
		product_name: '滴答清单',
		is_cn_site: 'true',
		site_domain: 'dida365.com',
		cdn_domain: '127.0.0.1'
	}
}

router.get('/:page', function (req, res, next) {
	res.render(route2Page[req.params.page].concat('.html'), configs.en)
})

router.get('/zh/:page', function (req, res, next) {
	res.render(route2Page[req.params.page].concat('_zh_CN.html'), configs.zh)
})

module.exports = router;
