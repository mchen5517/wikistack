var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false});

var Page = db.define('page',
{
	title: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
		}
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
		}
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false,
		validate: {
		}
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.TEXT)
	}
},
{
	getterMethods: {
		route: function() { return '/wiki/' + this.urlTitle; }
	}
}
);

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true,
		}
	},
},
{
	getterMethods: {
		route: function() { return '/users/' + this.id; }
	}
});

Page.hook('beforeValidate', function(page, options) {
	page.urlTitle = nameToUrl(page.title);
	page.tags = editTags(page.tags);
})

Page.belongsTo(User, { as: 'author'});


function nameToUrl(name){
	if(name){
		return name.split(" ").join('_').replace(/\W/g, '');
	} else {
		return Math.random().toString(36).substring(2,7);
	}

}

function editTags(tag){
	if(tag){
	return tag.replace(/\s/g,'').split(',');
	}
	return (tag)
}


module.exports = {
	Page: Page,
	User: User
};
