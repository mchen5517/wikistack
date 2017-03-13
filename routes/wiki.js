var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next) {
	Page.findAll()
	.then(function(pages){
		res.render('index', {pages: pages});
	})
	.catch(next);
});

router.post('/', function(req, res, next) {
	User.findOrCreate({
		where: {
			name: req.body.author_name,
			email: req.body.author_email
		}})
	.then(function(values){
		console.log(values);
		var user = values[0];

		var page = Page.build({
			title: req.body.title,
			content: req.body.content,
		});
		return page.save()
		.then(function(returnedPage){
			return returnedPage.setAuthor(user);
		});
	})
	.then (function(page){
		res.redirect(page.route);
	})
	.catch(next);
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.get('/users', function(req, res, next){
	User.findAll()
	.then(function(users){
		res.render('userspage', {users: users});
	})
	.catch(next);
});

router.get('/users/:id', function(req, res, next){
	User.findById(req.params.id).
	then(function(user){
		console.log("Reached!");
		res.render('userpage', {user: user});
	})
});


router.get('/:urlTitle', function (req, res, next){
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	})
	.then(function(foundPage){
		res.render('wikipage', { page: foundPage });
	})
	.catch(next);
});

module.exports = router;
