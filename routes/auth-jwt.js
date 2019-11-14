
const cred= {
    username: 'tom',
    password: '123'
}

module.exports = async function (fastify, options, next){
    //登录页
    fastify.get('/', async (request, reply)=>{
        reply.view('login',{token: '112233'})
    })
    fastify.get('/bv', async (request, reply) => {
        reply.view('login.bv', { token: '112233' })
    })

    //登入
    fastify.post('/login', async (request, reply) => {
        
        let result = cred
        if(result.password !== request.body.password ||result.username !== request.body.username){
            return {status:false,msg:'username or password error'}
        }

        const token = await reply.jwtSign({
            name: 'foo',
            role: ['admin', 'sender']
            // you may registering your csrf here
        })

        reply
            .setCookie('token', token, {
                domain: '.domain',
                path: '/'
            })
            .code(200)
            .send({status:true, msg:'登录成功'})
    })

    //登出
    fastify.post('/logout', async (request, reply) => {
        reply.log.info('logout')
        reply.view('/', {msg:'您已经登出'})
    })
    
    //注册
    fastify.post('/signup', async (request, reply) => {
        console.log('signup')
        return {}
    })

}