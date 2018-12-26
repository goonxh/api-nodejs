const express = require('express');
const router = express.Router();

const http = require("http");
const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");

router.get('/article/getArticle', (req,response) => {
    http.get("http://blog.xiehao.xin/archives/",function(res){
		let html = ""; //用来存储请求网页的整个html内容
        let titles = [];
		res.setEncoding("utf-8"); // 防止中文乱码
		//监听data事件，每次取一块数据
		res.on('data',function(chunk){
			html += chunk;
		})
		//监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
		res.on('end',function(){
            let $ = cheerio.load(html); //采用cheerio模块解析html
            let articleList = $('.main');
			articleData = [];
			articleList.find(".post").each(function(item){
                let article = $(this);
                let article_time = article.find(".post__time").text();
                let article_href = "http://blog.xiehao.online"+ article.find(".post__title").children('a').attr('href');
                let article_title = article.find(".post__title").children('a').text();
				articleData.push({
	                article_time : article_time,
	                article_href : article_href,
	                article_title : article_title
            	});
			})
			response.send(articleData);
            })
		})
});
module.exports = router;