
exports.checkNotLogin = function(req,res,next){
  if(req.session.user){
      req.session.error = '你已经登录过了，请不要重复登录';
      res.redirect('/');
  }else{
      next();
  }
}
exports.checkLogin = function(req,res,next){
  if(req.session.user){
      next();
  }else{
      req.session.error = '请页面需要登录后才能访问，请登录';
      res.redirect('/user/login');
  }
}