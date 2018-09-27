/**
 * Created by goonxh on 2018/9/10.
 */
const models = require('../server/db');
const express = require('express');
let http = require("http");
let cheerio = require("cheerio");
let url = 'http://jandan.net/top-ooxx';
const app = express();

const schedule = require('node-schedule');
let rule1 = new schedule.RecurrenceRule();
rule1.hour = [7,19]; rule1.minute = 0;


app.get('/ooxxpic',function(req,res){
	models.ooxxPic.find((err,data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data[data.length-1].pic);
        }
    });
})

const ooxxSchedule = schedule.scheduleJob(rule1, function(){
    saveOoxxPic();
});

function saveOoxxPic() {
	http.get(url, function(res) {
	    let html = '';
	    // 获取页面数据
	    res.on('data', function(data) {
	        html += data;
	    });
	    // 数据获取结束
	    res.on('end', function() {
	        let picListData = filterSlideList(html);
	        let newOoxx = new models.ooxxPic({
		        pic : picSrcData(picListData),
		        time : new Date().toLocaleString()
		    });
		    newOoxx.save((err,data) => {
		        if (err) {
		           console.log(err);
		        } else {
		           console.log('successed');
		        }
		    });
	    });
	}).on('error', function() {
	    console.log('获取数据出错！');
	});
}

/* 过滤页面信息 */
function filterSlideList(html) {
    if (html) {
        let $ = cheerio.load(html);
        let picList = $('ol.commentlist');
        let picListData = [];

        picList.find('li').each(function(item) {
            let pic = $(this);
            let pic_src_hash = pic.find('img').next("span.img-hash").text();
            let pic_src = new Buffer(pic_src_hash,'base64').toString();
            // 向数组插入数据
            picListData.push({
                pic_src: pic_src
            });
        });
        return picListData;
    } else {
        console.log('无数据传入！');
    }
}

/* 输出图片地址数组 */
function picSrcData(picListData) {
    // 计数
    let picSrcData =[]
    // 遍历信息列表
    picListData.forEach(function(item) {
        if(item.pic_src) {
	         // 获取原图链接地址
	        let pic_src = item.pic_src.replace(/mw600/,'large');
	        picSrcData.push(pic_src);
        }
    });
    return picSrcData;
}

module.exports = app;