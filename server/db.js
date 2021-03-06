// Schema、Model、Entity或者Documents的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
const mongoose = require('mongoose');
// 连接数据库 如果不自己创建 默认test数据库会自动生成
const options = {
    user:"xh",
    pass:"2012011234"
}
//远程连接
mongoose.connect('mongodb://104.225.154.24:27017/api');

// 为这次连接绑定事件
const db = mongoose.connection;
db.once('error',(err) => console.log('Mongo connection error:'+err));
db.once('open',() => console.log('Mongo connection successed'));

/************** 定义模式 Schema**************/
const ooxxPicSchema = mongoose.Schema({
    pic: Array,
    time: String,
});

const shijingSchema = mongoose.Schema({
    title: String,
    chapter: String,
    section: String,
    content: String,
});

const hupuPicSchema = mongoose.Schema({
    content: Object,
    time: String,
})

/************** 定义模型Model **************/
const Models = {
    ooxxPic : mongoose.model('ooxxPic',ooxxPicSchema),
    shijing : mongoose.model('shijing',shijingSchema),
    hupuPic : mongoose.model('hupuPic',hupuPicSchema),
}

module.exports = Models;
