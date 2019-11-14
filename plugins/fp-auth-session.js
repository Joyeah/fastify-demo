/**
 * 采用session验证。 
 * 依赖：
 * fastify-cookie
 * fastify-session
 * fastify-auth
 * 注：必须保证fastify开启https
 */
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('fastify-cookie'))
  .register(require("fastify-session"), {
    secret: require('uuid')(),
    expires: 1800000
  })
    
  //注意方法不使用async函数; 否则会导致两次进入路由函数
  fastify.decorate("authenticate", function (request, reply,next) {
    let url = request.req.url
    console.log('authenticate:', url)
    if(url != '/' && url.endsWith('/')){
      url = url.substr(0, url.length-1)
    }
    //ignored routes:
    if (['/', '/favicon.ico', '/auth', '/auth/login', '/auth/logout', '/auth/signup'].indexOf(url) != -1) {
      return next()
    }
    if (url.startsWith('/static') || url.startsWith('/css') || url.startsWith('/js')){
      return next()
    }
    let others = ['/config']
    if (others.includes(url)){
      return next()
    }
    

    try {
      //todo 检查sessionId是否变化
      if (request.session.authenticated){
        console.log('已经授权')
        return next()
      }else{
        console.log('未授权')
        reply.code(401).send({status:false, msg:'未授权'})
      }
    } catch (err) {
      // reply.send(err)
      reply.redirect('/auth')
    }
  }).register(require('fastify-auth'))
    .after(() => {
      fastify.addHook('preHandler', fastify.auth([fastify.authenticate]))
    })

})