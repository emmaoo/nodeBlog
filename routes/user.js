var express = require('express');
let User = require('../model').User;
var auth = require('../ware/auth');
let multer = require('multer');
//指定上传的文件的存放路径
let upload = multer({dest:'./public/uploads'});
var router = express.Router();
//注册 当客户端访问 /reg
router.get('/reg',auth.checkNotLogin,function(req,res){
   res.render('user/reg',{title:'注册',formUser:req.session.formUser||{}});

});
router.post('/reg',auth.checkNotLogin,upload.single('avatar'),function(req,res){
    let user = req.body;
    User.findOne({username:user.username},function(err,doc){
        if(err){
            req.session.error = '数据库操作失败';
            res.redirect('back');
        }else {
            if(doc){
                req.session.error = '此用户名已经被占用';
                req.session.formUser=user;
                res.redirect('back');
            }else{
                user.avatar = `/uploads/${req.file.filename}`;
                User.create(user).then(function(doc){
                    req.session.success = '注册成功,请登录';
                    res.redirect('/user/login');
                },function(err){
                    req.session.error = '数据库操作失败';
                    res.redirect('back');
                })
            }
        }
    })
});
//登录 当客户端访问 /login
router.get('/login',auth.checkNotLogin,function(req,res){
  res.render('user/login',{title:'登录'});
});
router.post('/login',auth.checkNotLogin,function(req,res){
  let user = req.body;
  User.findOne(user,function(err,doc){
      if(err){
        req.session.error = '数据库操作失败';
        res.redirect('back');
      }else{
          if(doc){
              req.session.user = doc;
              res.redirect('/');
          }else{
              req.session.error = '用户名或密码不正确';
              res.redirect('back');
          }
      }
  });
});
// 退出 当客户端访问 /logout 要求登录后才能退出
router.get('/logout',auth.checkLogin,function(req,res){
    req.session.user = null;
    res.redirect('/user/login');
});

module.exports = router;