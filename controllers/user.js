const Monk = require('monk');//链接mongodb数据库中间件
const db=new Monk('localhost:27017/tododb');
let users = db.get('coder');
var xss = require('xss')
var uuid = require('uuid')
const jwt = require('jsonwebtoken')
//controllers
const config = require('../config/default.json')
/**
 * 注册新用户
 * @param {Function} next          [description]
 * @yield {[type]}   [description]
 */
exports.signup = async (ctx, next) => {
    let params = ctx.request.body;
    let signupState = true;
    let role = xss(params.role.trim()) ? config.auth.cors[xss(params.role.trim())] : null;
    if(!role){
       return ctx.body = {
            err:true,
            res:'邀请码不对拒绝注册!'
        }
    }
    let data = {
        username:xss(params.username.trim()),
        password:xss(params.password.trim()),
        fromemail:xss(params.fromemail.trim()),
        fromkey:xss(params.fromkey.trim()),
        toemail:xss(params.toemail.trim()),
        role:xss(params.role.trim()),
        uuid:uuid.v4()
    }
    for(let r in data){
        if(r.lengtn < 4){
            signupState = false;
        }
    }
	if(signupState && !await users.count({username:data.username}) && data.password.length > 4){
        await users.insert(data)
        ctx.body = {
            err:false,
            res:"注册成功"
        }
    }else{
        ctx.body = {
            err:true,
            res:'注册失败!'
        }
    }
    return next
}

exports.login = async function (ctx, next) {
    try {
      let loginState = false;
      let params = ctx.request.body;
      let model = await users.findOne({username:xss(params.username.trim())});
      console.log(model.password,xss(params.password.trim()))
      if(model && model.password === xss(params.password.trim())){
        loginState = true;
        // model.role = 'admin';
        model.ip = ctx.request.ip;
      }
        if (loginState) { // 判断用户名密码等认证方式，这里默认通过
            // const user = { userId: '123', role: 'admin' }
            const tokenSign = await jwt.sign({  // exp设置过期时间，这里是24小时
                ...model, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
            }, config.auth.secret)
            ctx.tokenSign = tokenSign // 向后面的路由传递TOKEN加密令牌
            console.log(ctx.tokenSign)
            await next()
        } else {
            ctx.status = 401
            ctx.body = '用户名或密码错误'
        }
    } catch (error) {
        console.error(error)
        ctx.status = 401
        ctx.body = '用户名或密码错误'
    }
  }
