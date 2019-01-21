const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const url = require('url');
const models = require('../server/db');
const schedule = require('node-schedule');
const express = require('express');
const app = express();
let rule2 = new schedule.RecurrenceRule();
rule2.hour = [8,18]; rule2.minute = 0;

let allUrl = [];
let output = [];
let hupuUrl = 'https://bbs.hupu.com/selfie-1';
let i=0;


app.get('/xapi/hupupic',function(req, res){
    models.hupuPic.find((err,data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data[data.length-1].content);
        }
    });
})

const hupuSchedule = schedule.scheduleJob(rule2, function(){
    autoGetPic();
});

function autoGetPic() {
    const allUrlPromise = hupuUrl => new Promise((resolve, reject) => {
        superagent.get(hupuUrl)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }
                let $ = cheerio.load(res.text);
                $('.titlelink>a:first-child').each((idx, ele) => {
                    let $element = $(ele);
                    let href = url.resolve(hupuUrl, $element.attr('href'));
                    allUrl.push(href);
                })
                if(allUrl) resolve(allUrl);
            })
    })

    allUrlPromise(hupuUrl).then((res) => {
        let t = setInterval(() => {
            getPicFromHupu(res[i])
            if (i === res.length - 1) {

                clearInterval(t);
                let newHupu = new models.hupuPic({
                    content: output,
                    time : new Date().toLocaleString()
                });
                newHupu.save((err,data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('successed');
                    }
                });
            }
        }, 500)

    }).finally(()=>{

    })
}


const getPicFromHupu = href =>{
    let contentPic = [];
    superagent.get(href)
        .set('cookie','__dacevid3=0xc4c0d0cc50942264; _dacevid3=b24e31dc.43f1.f829.bfa6.5b3e963f7191; __gads=ID=99eb855e1e789336:T=1529385179:S=ALNI_MbefAUQP7-T9TJ8KkokqWiJjtes0g; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22164bab6ce6b8ab-0f391912c22d0e-47e1039-2073600-164bab6ce6c4b8%22%2C%22%24device_id%22%3A%22164bab6ce6b8ab-0f391912c22d0e-47e1039-2073600-164bab6ce6c4b8%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%2C%22%24latest_referrer_host%22%3A%22www.baidu.com%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%7D%7D; UM_distinctid=16665f21954889-0f0570183efcce-8383268-1fa400-16665f219552b; PHPSESSID=305a8afa9ab958ec5240feaf57927f24; _cnzz_CV30020080=buzi_cookie%7Cb24e31dc.43f1.f829.bfa6.5b3e963f7191%7C-1; Hm_lvt_39fc58a7ab8a311f2f6ca4dc1222a96e=1540773926,1540774398,1540780755,1541648418; Hm_lpvt_39fc58a7ab8a311f2f6ca4dc1222a96e=1541662138; _fmdata=EvZ0W22qKmHrjhUAQo4wsvwItro1o%2BcnGUfZizAqDJEl1Bjc1wOWDbMpDZ6n8Rz05Sb9002xx005hS4UTb2%2BzfZb2gxjueZZFfrWMXOk6uM%3D')
        .end((err, res) => {
            if (err) {
                console.log(err);
            }
            let $ = cheerio.load(res.text);
            let add = href;
            let title = $('.bbs-hd-h1>h1').attr('data-title'); // 帖子标题
            let tximg = $('.headpic:first-child>img').attr('src');// 用户头像
            let txname = $('.j_u:first-child').attr('uname'); // 用户ID
            $('.quote-content>p>img').each(function(item){
                if(item === 0||item === 1||item === 2) {
                    let pic = $(this);
                    contentPic.push(pic.attr('src').replace('?x-oss-process=image/resize,w_800/format,webp',''));
                }else{
                    let pic = $(this);
                    contentPic.push(pic.attr('data-original').replace('?x-oss-process=image/resize,w_800/format,webp',''));
                }

            })
            let library = {
                'address': add,
                'title': title,
                'ID': txname,
                'avatar': tximg,
                contentPic: contentPic
            };
            output.push(library);
            console.log(i);
            i++;
        })
}
module.exports = app;