var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false});

var Page = db.define('page',
{
	title: {
		type: Sequelize.STRING,
		validate: {
			notNull: true
		}
	},
	urlTitle: {
		type: Sequelize.STRING,
		validate: {
			notNull: true
		}
	},
	content: {
		type: Sequelize.TEXT,
		validate: {
			notNull: true
		}
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	}
},
{
	getterMethods: {
		fullUrl: function() { return '/wiki/'+this.urlTitle; }
	}
}
);

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		validate: {
			notNull: true
		}
	},
	email: {
		type: Sequelize.STRING,
		validate: {
			isEmail: true,
			notNull: true
		}
	}
});

Page.hook('beforeValidate', function(page, options) {
  page.urlTitle = nameToUrl(page.urlTitle)
})

// Page.hook('afterValidate', function(user, options) {
//   return sequelize.Promise.reject("I'm afraid I can't let you do that!")
// })


function nameToUrl(name){
  if(name){
  return name.split(" ").join('_').replace(/\W/g, '');
  } else {
    return Math.random().toString(36).substring(2,7);
  }

}


module.exports = {
	Page: Page,
	User: User
};
