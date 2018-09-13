const express = require('express');
const router = express.Router();
var cors = require('cors');

var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");
var request = require("request");
/*var i = 0;*/
/*var url = "http://blog.xiehao.online/archives/";*/

router.get('/article/getArticle',cors(), (req,response) => {
    http.get("http://blog.xiehao.online/archives/",function(res){
		var html = ""; //用来存储请求网页的整个html内容
		var titles = [];
		res.setEncoding("utf-8"); // 防止中文乱码
		//监听data事件，每次取一块数据
		res.on('data',function(chunk){
			html += chunk;
		})
		//监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
		res.on('end',function(){
			var $ = cheerio.load(html); //采用cheerio模块解析html
			var articleList = $('.main');
			articleData = [];
			articleList.find(".post").each(function(item){
				var article = $(this);
				var article_time = article.find(".post__time").text();
				var article_href = "http://blog.xiehao.online"+ article.find(".post__title").children('a').attr('href');
				var article_title = article.find(".post__title").children('a').text();
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