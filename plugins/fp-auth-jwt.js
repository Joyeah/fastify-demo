/**
 * 尝试采用jwt验证
 */
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require("fastify-jwt"), {
    secret: "supersecret"
  })
    .register(require('fastify-cookie'))

  
  fastify.decorate("authenticate", async function (request, reply,next) {
    if (['/auth', '/auth/login', '/auth/signup'].indexOf(request.req.url) != -1) {
      return next()
    }
    if (request.req.url.startsWith('/css') || request.req.url.startsWith('/js')){
      return next()
    }
    reply.log.info('authenticate..')
    try {
      await request.jwtVerify()
    } catch (err) {
      // reply.send(err)
      reply.redirect('/auth')
    }
  }).register(require('fastify-auth'))
    .after(() => {
      fastify.addHook('onRequest', fastify.auth([fastify.authenticate]))
    })


})