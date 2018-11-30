const models = require('../server/db');
const express = require('express');
let http = require("http");
const app = express();

app.get('/shijing', function (req, res) {
    let page = parseInt(req.query.page)?parseInt(req.query.page):1, pageSize = parseInt(req.query.pageSize)?parseInt(req.query.pageSize):15;
    let search = req.query.search?req.query.search:'';
    let query = search?models.shijing.find({$text:{$search:search}}):models.shijing.find({});
    let pagination = {};
    models.shijing.countDocuments({},function (error, data) {
        if(error) throw error;
        if(data){
            pagination.total = data;
            pagination.pageSize = pageSize;
            pagination.currentPage = page;
            query.skip((page-1)*pageSize).limit(pageSize).exec((error, data) => {
                if(error) throw error;
                if(data) {
                    res.json({data:data,pagination:pagination});
                }
            })
        }
    });
})

module.exports = app;