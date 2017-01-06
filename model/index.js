let mongoose = require('mongoose');
mongoose.Promise = Promise;
let ObjectId = mongoose.Schema.Types.ObjectId;
var config = require('../config');
mongoose.connect(config.dbUrl);
//用户的模型
let UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    avatar:String,
    email:String
});
module.exports.User = mongoose.model('User',UserSchema);

//文章的模型
let ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    user:{type:ObjectId,ref:'User'},
    createAt:Date
});
exports.Article = mongoose.model('Article',ArticleSchema);