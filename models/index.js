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
	instanceMethods: {
		getUrlTitle: function() { return this.urlTitle; }
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

var routes = 

module.exports = {
	Page: Page,
	User: User
};