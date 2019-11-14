let cred = {
    username: 'tom',
    password: '123'
}
module.exports = async function (fastify, options, next){
    //登录页
    fastify.get('/', async (request, reply)=>{
        //切记：session依赖https,否则不会保存值
        request.session.rd = Math.random() * 10 ** 16
        reply.view('login', { token: request.session.rd})
    })
    fastify.get('/bv', async (request, reply) => {
        reply.view('login.bv', { token: '112233' })
    })

    //登入:返回json结果
    fastify.post('/login', async (request, reply) => {
        const {username, password, token} = request.body
        if(token != request.session.rd){
            console.log('随机码不匹配.')
            return {status:false, msg:'非法登录'}
        }
        if (!username || !password){
            return {status:false, msg:'用户名或密码不能为空'}
        } 
        //todo 查询用户信息
        let result = cred;
        if(result.password !== password ||result.username !== username){
            return {status:false,msg:'username or password error'}
        }
        //验证通过
        request.session.authenticated = true;
        request.session.uname = username;
        let sessionId = request.session.sessionId;
        reply
            .setCookie('sessionId', sessionId, {
                // domain: '.domain',
                path: '/'
            })
            .setCookie('uid', '1101', {
                path: '/'
            })
            .setCookie('uname', username, {
                path: '/'
            })
            .code(200)
            .send({status:true, msg:'登录成功'})
    })

    //登出:重定向到首页
    fastify.all('/logout',  (request, reply, next) => {
        if(request.session.authenticated){
            console.log(request.session.uname);
            request.session.authenticated = false;
            console.log('已经登出')
            request.sessionStore.destroy(request.session.sessionId, err=>{
                if(err){
                    reply.status(500)
                    reply.send('Internal Server Error')
                }else{
                    reply.setCookie('uid', '', { expire: new Date().toUTCString() })
                    .redirect('/')
                }
            })
        }else{
            reply.setCookie('uid', '', { expire: new Date().toUTCString() }).redirect('/')
        }
    })
    
    //注册
    fastify.post('/signup', async (request, reply) => {
        console.log('signup')
        return {}
    })

    next()
}