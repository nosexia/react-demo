const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);
    else next();
});

app.use( '/dev-api', createProxyMiddleware({
    target: 'http://10.10.10.21:80',
     changeOrigin: true
}))

app.listen(8088);