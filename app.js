const express=require('express')
const cors=require('cors')
const ejs=require('ejs')
const session=require('express-session')
const ev = require('express-validation')
const path=require('path')
const fs=require('fs')
const apiRouter = require('./router/api')
const { json } = require('express')


const app=express()

//渲染模板
app.engine('html',ejs.renderFile)
app.set('views',path.join(__dirname,'/fronted'))
app.set('view engine','html')



// 跨域处理，分离前后端
app.use(cors())

app.use(express.urlencoded({extended:false}))//x-www-form-urlencoded
app.use(express.json())//json
const secretkey='zakiaatot'
app.use(session({
    name:'zakiaatot',
    secret:secretkey,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*1200,   //过期时间
        secure:false,
    }
}))//session设置
app.use((req,res,next)=>{
    res.error=function(err){
        res.json({
            status:0,
            msg:err instanceof Error?err.message:err
        })
    }
    res.success=function(msg){
        res.json({
            status:1,
            msg:msg
        })
    }
    next()
})//自定义中间件


//静态资源挂载
app.use('/',express.static(path.join(__dirname,'/frontend')))




//路由
app.use('/',apiRouter)
app.get('/',(req,res)=>{
    return res.sendFile('index')
})
app.get('*',(req,res)=>{
    return res.error({
        code:404,
        msg:'Not Found'
    })
})







app.use(function (err, req, res,next) {
    // 数据验证失败
    if (err instanceof ev.ValidationError) return res.error({
        code:400,
        msg:'数据输入格式错误'
      })
    // 未知错误
    if (err) return res.error(err)
    return res.error({
        code:404,
        msg:'Not Found'
    })
})

app.listen(9002,()=>{
    console.log('Running in \nhttp://localhost:9002')
    //全局变量用于实现返回打卡任务的实时进度
    global.progess={}
    file=path.join(__dirname,'package.json')
    //获取版本信息
    fs.readFile(file,'utf-8',(err,data)=>{
        if(err){
            global.progess.version='unknow'
        }
        else{
            global.progess.version=JSON.parse(data).version
            console.log('Version:'+global.progess.version)
        }
    })
    
})
//启动