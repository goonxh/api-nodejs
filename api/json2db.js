const express = require('express');
const fs = require("fs");
const path = require('path');
const models = require('../server/db');

let jsonFile = path.join(__dirname, '../data/shijing.json');
fs.readFile(jsonFile, 'utf-8', function (err, data) {
    if(err) throw err;
    /*JSON.parse(data).forEach((item,i) => {
        let newShijing = new models.shijing({
            title: item.title,
            chapter: item.chapter,
            section: item.section,
            content: item.content,
        })
        newShijing.save();
        console.log(i)
    })*/
   //console.log(JSON.parse(data).length);
})