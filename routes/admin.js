// routes/v1/users.js
module.exports = function (fastify, opts, next) {
  fastify.get('/user', (request, reply)=>{
    console.log('user')
    reply.send({msg: 'hello world'})
  })
  next()
}