'use strict';

var koa = require('koa');
var serveIndex = require('./koa-serve-index.js');
var fs = require('fs');
var path = require('path');
var url = require('url');

var options = {};

var app = koa();

app.use(serveIndex(__dirname));

app.use(function* () {
  console.log('test');
  this.body = 'hello world!';
})


app.listen(3000);