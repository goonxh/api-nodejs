// 引入编写好的api
const article = require('../api/blog_spider');
const ooxxPic = require('../api/jiandan_spider_everyday');
const string2qrcode = require('../api/string2qrcode');
const shijing = require('../api/shijing');
// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');
// 引入处理post数据的模块
const bodyParser = require('body-parser')
// 引入Express
const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(article);
app.use(ooxxPic);
app.use(string2qrcode);
app.use(shijing);
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '/')))
// 因为是单页应用 所有请求都走/dist/index.html
app.get('/', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
    res.send(html)
})
// 监听8989端口
app.listen(8989);
console.log('success listen port: 8989');
