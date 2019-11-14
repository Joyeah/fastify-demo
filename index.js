const fs = require('fs')
const path = require('path')
const notifier = require('node-notifier')
const Handlebars = require('handlebars')
const { registerPartials } = require('./common/hbsutil')

console.log('NODE_ENV:', process.env.NODE_ENV)
const config = require('config').util.toObject()
console.log('config: ', config.desc)

//创建fastify实例
const fastify = require('fastify')({
  logger: Object.assign({ level: 'info' }, config.log),
  // https: {
  //   key: fs.readFileSync(path.join(__dirname, 'https', 'server.key')),
  //   cert: fs.readFileSync(path.join(__dirname, 'https', 'server.crt'))
  // },
  // http2: true,
})

//bind config information
fastify.configinfo = config

//static folder:
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'static'),
  prefix: '/static/', // optional: default '/'
})

//templates
fastify.register(require('point-of-view'), {
  engine: {
    handlebars: Handlebars
  },
  templates: path.resolve('templates'),
  includeViewExtension: true
}).after(() => {
  //register partials
  fastify.log.debug('register partials')
  Handlebars.registerPartial('test', '<header>this is Test Partial</header>')
  registerPartials()
})

//routes
fastify.register(require('./routes/default'))
fastify.register(require('./routes/admin'), { prefix: 'admin' })
fastify.register(require('./routes/auth-session'), { prefix: 'auth' })

//auth session
fastify.register(require('./plugins/fp-auth-session'))


fastify.addHook('onSend', function (req, reply, payload, next) {
  fastify.log.warn('onSend')
  if (reply.hasHeader('content-type')) {
    reply.log.info(reply.getHeader('content-type'))
  }
  // if (payload)  fastify.log.info(payload.filename)
  next()
})

//start listening
let server_cfg = config.server || {}
server_cfg = Object.assign({ ip: '127.0.0.1', port: 3000 }, server_cfg)
fastify.listen(server_cfg.port, server_cfg.ip, (err, address) => {
  if (err) console.error(err)
  fastify.log.info(`listen: ${address}`)
  console.log(`listen: ${address}`)
  notifier.notify({ title: '应用提示', message: 'fastify-demo Web Application starting.' })
})

