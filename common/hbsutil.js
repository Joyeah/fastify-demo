/**
 * Handlebars Partials registered 
 */
const Handlebars = require('handlebars')
const readdir = require('fs').readdir
const readFile = require('fs').readFile
const resolve = require('path').resolve
const join = require('path').join
/**
 * 注册Handlebars Partials. 
 * partialsDir默认为'./templates/partials'
 */
exports.registerPartials = (partialsDir)=>{
    partialsDir = partialsDir || './templates/partials'
    readdir(partialsDir, (err, files)=>{
        files.forEach((file, index)=>{
            let key = file.substr(file.lastIndexOf('/')+1, file.lastIndexOf('.'))
            console.log(index, key, resolve(file))
            readFile(join(partialsDir, file), 'utf-8', (err, data)=>{
                if(err) console.error(err)
                Handlebars.registerPartial(key, data)
            })
        })
    })
}