async function routes(fastify, options, next) {
    // const sequelize = fastify.sequelize;
    // const log = fastify.log;

    fastify.get('/', async (request, reply) => {
        const session = request.session
        console.log(session)
        reply.view('index', { title: 'HomePage', content: 'Welcome to You!', sessionId: session.sessionId })
        // reply.sendFile('index.html')  // serving path.join(__dirname, 'public', 'myHtml.html') directly
    })
    
    fastify.get('/config', async (request, reply) => {
        let options = fastify.configinfo
        let sessionid = request.session.sessionId
        return options
    })

    //跨站请求
    fastify.get('/cors/:type/:key', (request, reply) => {
        const type = request.params.type
        if(type == 'stock'){
            let randomstr = Math.random()
            const key = request.params.key
            let url = `http://so.hexun.com/ajax.do?key=${key}&type=stock?math=${randomstr}`
            axios.get(url,params)
            .then(res => {
                console.log(res)
                reply.send(res)
            })
            .catch(err => {
                console.error(err)
                reply.send({success:false, err:err})
            })
        }
    })
}

module.exports = routes