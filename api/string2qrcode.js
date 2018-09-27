const QRCode = require('qrcode');
const express = require('express');
const app = express();

app.post('/string2qrcode',(req,res) =>{
    let reqString = req.body.stringVal;
    let opts = {
        errorCorrectionLevel:'H',
        width: req.body.codeSize,
        color: {
            dark: req.body.darkColor?req.body.darkColor:'000000ff', // 暗模块颜色
            light: req.body.lightColor?req.body.lightColor:'ffffffff', // 亮模块颜色
        }
    }
    QRCode.toDataURL(reqString, opts, function(err, url) {
        if(err) throw err;
        res.send({imgUrl:url});
    })
    /*QRCode.toFile('../qrcode.jpg', reqString, opts, function (err) {
        if (err) throw err;
        console.log('done');
    })*/
})

module.exports = app;
