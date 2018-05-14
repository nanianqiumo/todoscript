const router = require('koa-router')()
// const jwt = require('jsonwebtoken')
// //controllers
// const config = require('../config/default.json')
const _Test = require('../controllers/test')
const _User = require('../controllers/user')
const _Todo = require('../controllers/todo')
// const passport = require('../server/passport')

router.prefix('/api')

router.get('/*',async function(ctx,next){
  ctx.response.type = 'application/json';
  await next();
})

router.post('/login', _User.login)


router.post('/login', async function (ctx, next) {
  ctx.body = ctx.tokenSign
})

router.get('/test', async function (ctx, next) {
  ctx.body = ctx.tokenVerify 
})

router.post('/addtodo', _Todo.addtodo) // 添加TODO
router.get('/gettime', _Todo.gettime) // 返回Todo 时间

router.get('/signup', _User.signup)

router.get('/test', _Test.test)

router.get('/bar', async function (ctx, next) {
  // ctx.body = 'this is a users/bar response';
  await next();
},function(ctx, next){
  ctx.body += '_______';
})

module.exports = router
