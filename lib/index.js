'use strict';

var koa = require('koa');
var serveIndex = require('./koa-serve-index.js');
var fs = require('fs');
var path = require('path');
var url = require('url');

var options = {};

var app = koa();

var workDir = __dirname.split('/lib')[0];

app.use(serveIndex(workDir));

app.use(function* () {
  console.log('test');
})


app.listen(3000);