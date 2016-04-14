'use strict';

var koa = require('koa');
var serveIndex = require('./koa-serve-index.js');
var serveStatic = require('./koa-serve-static.js');
var fs = require('fs');
var path = require('path');
var url = require('url');

var options = {};

var app = koa();

app.use(serveIndex(__dirname));

app.use(function* (next) {
  console.log('test');
  yield next;
})

app.use(serveStatic(__dirname));


app.listen(3000);