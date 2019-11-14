const Sequelize = require('sequelize')

exports.models = [
    {
        name:"user",
        alias:"User",
        schema: {
            username: Sequelize.STRING(50),
            password: Sequelize.STRING(100)
        },
        comment:'用户表'
    },
    {
        name:"postgroup",
        alias: "PostGroup",
        schema: {
            title: Sequelize.STRING(30),
            comment: Sequelize.STRING(50)
        },
        comment: '帖子分组，每组内的帖子顺序分配到指定的帐号上'
    },
    {
        name:"post",
        alias:"Post",
        schema: {
            groupid: Sequelize.INTEGER,
            stock: Sequelize.STRING(10),
            title: Sequelize.STRING(100),
            content: Sequelize.STRING(500),
            creator: Sequelize.STRING(30),
            account: Sequelize.STRING(10),
            status_thx: { type: Sequelize.STRING(1), comment:'同花顺,0未发送,1已经发送,2发送失败,3审核成功,4审核失败'},
            status_df: {type:Sequelize.STRING(1),comment:'东方财富'},
            status_xq: {type:Sequelize.STRING(1),comment:'雪球'}
        },
        comment: '帖子,一条消息发送到同一手机号注册的多个网站平台'
    },
    {
        name: "account",
        alias: "Account",
        schema: {
            username: {type: Sequelize.STRING(50), comment:'用户名，一般为手机号'},
            password: Sequelize.STRING(100),
            nickName: Sequelize.STRING(30),
            website: {
                type: Sequelize.ENUM,
                values: ['thx', 'df', 'xq']
            }, 
            loginip: {type: Sequelize.STRING(50), comment: '发起登录的所在主机IP'}
        },
        comment: '各网站的帐号,一般以手机号注册'
    }

]