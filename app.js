// 系统配置参数
const config = require('./config/default.json')
const port = config.server.port
const koaBody = require('koa-body')
const jwt = require('jsonwebtoken')
const xauth = require('./server/auth.js')
const log = require('tracer').colorConsole({ level: config.log.level })

const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const api = require('./routes/api')
const Monk = require('monk');//链接mongodb数据库中间件
const db=new Monk('localhost:27017/tododb');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const crond = require('./server/crond');

app.keys = ['123456'];


crond.scheduleCronstyle();
app.use(koaBody())
app.use(require('koa-static')(__dirname + '/public'))
// 参数1：认证配置，参数2：TOKEN提取规则，参数3：自定义错误处理
app.use(xauth(config.auth, (v) => v, (ctx) => {  
    if (ctx.body.name == 'TokenExpiredError') {
        ctx.body.code = -1
        ctx.body.msg = '自定义错误信息，TOKEN已过期'
    }
}))
// error handler
onerror(app)



// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())


app.use(views(__dirname + '/views', {
  // extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// routes
app.use(index.routes(), index.allowedMethods())
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
// log.info(`TodoScript应用启动【执行环境:${process.env.NODE_ENV},端口:${port}】`)
