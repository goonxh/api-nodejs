const QRCode = require('qrcode');
const request = require('request');
const express = require('express');
//const router = express.Router();
const fs = require("fs");
const app = express();

app.post('/string2qrcode',(req,res) =>{
    let reqString = req.body.stringVal;
    console.log(req)
    console.log(reqString);
    QRCode.toDataURL(reqString, function(err, url) {
        res.send({'imgUrl':url});
    })
})

module.exports = app;
