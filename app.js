var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.resolve('public')));//访问静态文件
var bodyParser = require('body-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);//connect-mongo可以把 session存放在数据库里
app.set('view engine','html');//设置模板引擎
app.set('views',path.resolve('views'));
app.engine('html',require('ejs').__express);
app.use(bodyParser.urlencoded({extended:true}));
var config = require('./config');
app.use(session({
    secret:'emma',
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({
        url:config.dbUrl
    })
}));
app.use(function(req,res,next){
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;
    req.session.error = null;
    req.session.success= null;
    res.locals.user = req.session.user;
    next();
});
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.listen(8080);