'use strict';

var express = require('express');
var httpProxy = require('http-proxy'),
    path = require('path');


// We need to add a configuration to our proxy server,
// as we are now proxying outside localhost
var proxy = httpProxy.createProxyServer({
    changeOrigin: true
});

var app = express();


// setup webpack proxy
var bundle = require('./bundle.js');
bundle();
app.all('/resources/**.*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
});

// provide access to static files
var staticFiles = path.join(__dirname, '..', 'build');
app.use(express.static( staticFiles ));


// start the server
app.listen('4000', function () {
    console.log('Server running');
});
