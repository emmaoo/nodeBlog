var express = require('express');
let Article = require('../model').Article;
var router = express.Router();
//注册 当客户端访问 /
router.get('/',function(req,res){
    let pageNum = isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);//取哪一个页数据
    let pageSize =isNaN(req.query.pageSize)?3:parseInt(req.query.pageSize);//取每页的记录数
    var count = Article.count({});//总记录数
    var records = Article.find({}).skip(pageSize*(pageNum-1)).limit(pageSize).populate('user');//某一个页的数据
    Promise.all([count,records]).then(function(result){
        let total = result[0];//总记录数
        let docs = result[1];//当前页的记录
        res.render('index',{
            title:'首页',
            docs,
            pageNum,
            pageSize,
            totalPage:Math.ceil(total/pageSize)
        });
    },function(err){
        req.session.error= '数据查询失败';
        res.redirect('back');
    });
});

module.exports = router;