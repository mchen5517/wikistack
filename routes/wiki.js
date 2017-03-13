var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');


router.get('/wiki', function (req, res, next) {
	res.redirect('/');
});

router.get('/', function (req, res, next) {
	Page.findAll()
		.then(function (pages) {
			res.render('index', { pages: pages });
		})
		.catch(next);
});

router.post('/', function (req, res, next) {
	User.findOrCreate({
		where: {
			name: req.body.author_name,
			email: req.body.author_email
		}
	})
		.then(function (values) {
			var user = values[0];

			var page = Page.build({
				title: req.body.title,
				content: req.body.content,
			});
			return page.save()
				.then(function (returnedPage) {
					return returnedPage.setAuthor(user);
				});
		})
		.then(function (page) {
			res.redirect(page.route);
		})
		.catch(next);
});

router.get('/wiki/add', function (req, res, next) {
	res.render('addpage');
});

router.get('/users', function (req, res, next) {
	User.findAll()
		.then(function (users) {
			res.render('userspage', { users: users });
		})
		.catch(next);
});

router.get('/users/:id', function (req, res, next) {
	var findId = User.findById(req.params.id);
	var pagePromise = Page.findAll({
		where: {
			authorId: req.params.id
		}
	});
	Promise.all([findId, pagePromise]).then(function (values) {
		var user = values[0];
		var pages = values[1];
		res.render('userpage', { user: user, pages: pages });
	}).catch(next);
});

router.get('/wiki/search', function (req, res, next) {
	var allTags = req.query.tags.replace(/\s/g, '').split(',');
	Page.findAll({
		where: {
			tags: {
				$overlap: allTags
			}
		}
	}).then(function (pages) {
		res.render('index', { pages: pages });
	})

});

router.get('/search', function (req, res, next) {
	res.render('wikisearch');
})


router.get('/wiki/:urlTitle/similar', function (req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	})
		.then(function (value) {
			return Page.findAll({
				where: {
					tags: {
						$overlap: value.tags
					}
				}
			});
		})
		.then(function (pages) {
			res.render('index', { pages: pages });
		});
});


router.get('/wiki/:urlTitle', function (req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		},
		include: [
			{ model: User, as: 'author' }
		]
	})
		.then(function (foundPage) {
			if (foundPage === null) {
				res.status(404).send("Page does not exist");
			} else {
				res.render('wikipage', { page: foundPage });
			}
		})
		.catch(next);
});

router.post('/wiki/:urlTitle/update', function (req, res, next) {
	Page.update({
		tags: req.body.tags
	}, {
			where: {
				urlTitle: req.params.urlTitle
			}, returning: true
		}).then(function (value) {
			res.redirect(value[1][0].route);
		}).catch(function (x) {
		})
})

router.get('/wiki/:urlTitle/edit', function (req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		},
		include: [
			{ model: User, as: 'author' }
		]
	})
		.then(function (foundPage) {
			if (foundPage === null) {
				res.status(404).send("Page does not exist");
			} else {
				res.render('editwikipage', { page: foundPage });
			}
		})
		.catch(next);
});



module.exports = router;
