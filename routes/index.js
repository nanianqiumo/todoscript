const router = require('koa-router')()


router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/index', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


router.get('/login',async ctx => {
  await ctx.render('login')
})


router.get('/auth', async (ctx, next) => {
  // ctx.body = 'koa2 string'
  if( await ctx.isAuthenticated()) {
    ctx.body = {
      msg: 'success'
    }
  } else {
   ctx.status = 401
   ctx.body = {
     msg: 'auth fail'
   }
 }
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
