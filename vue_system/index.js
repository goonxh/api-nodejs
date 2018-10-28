const models = require('../server/db');
const express = require('express');
const http = require("http");
const app = express();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


// 定义签名
const secret = 'salt';
// 生成token
const token = jwt.sign({
    name: 'vueToken'
}, secret, {
    expiresIn: 6000 //秒到期时间
})

// 使用中间件验证token合法性
app.use(expressJwt({
    secret: secret
}).unless({
    path: ['/login']  //除了这些地址，其他的url都需要验证
}))

// 拦截器
app.use(function (err, req, res, next) {
    //当token验证失败时会抛出如下错误
    if(err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
})

/**
 * 注册 /register
 */
app.post('/register',(req,res) => {
    let newUser = new models.user({
        username: req.body.username,
        name: req.body.name?req.body.name:null,
        password: req.body.password,
        role: req.body.role?req.body.role:null,
        email: req.body.email?req.body.email:null,
    })
    newUser.save((err,data) =>{
        if(err) {
            res.send(err);
        }else{
            res.send('1');
        }
    })
})

/**
 * 登录 密码验证  /login
 */
app.post('/login',(req,res) =>{
    models.user.findOne({username: req.body.username}, (error, user) =>{
        if(error) throw error;
        if(!user) {
            res.send('用户名不存在');
        }else {
            user.comparePassword(req.body.password, function(err, isMatch){
                if(err) res.send(err);
                if(isMatch) {
                    res.json({
                        success:1,
                        user:user,
                        token:token
                    });
                } else {
                    res.send('密码错误');
                }
            })
        }
    })
})
/**
 * 根据用户id获取用户信息 /userInfo
 */
app.post('/userInfo',(req,res) =>{
    models.user.findOne({_id: req.body.id}, (error, user) =>{
        if(error) throw error;
        if(!user) {
            res.send('用户不存在');
        }else {
            res.send({
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            })
        }
    })
})


module.exports = app;

