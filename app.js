const express = require('express');
const nunjucks = require('nunjucks');
var app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
//var router = express.router();
var models = require('./models');
var wikiRouter = require('./routes/wiki');
// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);

app.use(express.static('public'));

app.use('/', wikiRouter);
app.use(function (req, res, next){
    res.status(404).send('404');
})


models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error);
