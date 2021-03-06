'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var koa = require('koa');
var serveList = require('koa-serve-list');
var serveStatic = require('koa-serve-static');
var proxy = require('proxy-middleware');
var tinyLr = require('tiny-lr');
var watch = require('watch');
var fs = require('fs');
var path = require('path');
var open = require('open');
var url = require('url');
var extend = require('node.extend');
var isarray = require('isarray');

//module.exports = function (options) {
//  // default options
//  var defaults = {
//    host: 'localhost',
//    port: 8000,
//    path: '/',
//    fallback: false,
//    https: false,
//    open: false
//
//  };
//
//  console.log('hello world');
//  var app = koa();
//  //app.use(serveIndex(__dirname));
//  //app.use(serveStatic(__dirname));
//  console.log('hi');
//  app.listen(3000);
//
//}

var options = {};

var app = koa();

var workDir = __dirname.split('/lib')[0];

var _serveList = serveList(workDir, options);

function test() {
  console.log('hi');
}

app.use(function* (next) {
  var ctx = {};
  ctx.req = this.req;
  ctx.res = this.res;
  yield _serveList(ctx, next);

  yield next;
});

app.use(function* (next) {
  console.log('hello  world!');
});

app.listen(3000);


//function createServer(dir, opts, fn) {
//  dir = dir || fixtures
//
//  const _serveIndex = serveList(dir, opts)
//
//  const app = new Koa()
//
//  app.use((ctx) => {
//    _serveIndex(ctx).catch((err) => {
//      ctx.res.statusCode = err ? (err.status || 500) : 404
//      ctx.res.end(err ? err.message : 'Not Found')
//    })
//  })
//
//  const _serveStatic = serveStatic(dir, opts)
//
//  app.use((ctx) => {
//    fn && fn(ctx.req, ctx.res)
//    _serveStatic(ctx).catch((err) => {
//      ctx.res.statusCode = err ? (err.status || 502) : 404
//      ctx.res.end(err ? err.stack : 'sorry!')
//    })
//  })
//
//  return app.listen(3000)
//}
//
//var workDir = __dirname.split('/lib')[0];
//console.log(workDir);
//
//var server = createServer(workDir);
