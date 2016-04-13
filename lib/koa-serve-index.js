'use strict';

var accepts = require('accepts');
var createError = require('http-errors');
var debug = require('debug')('serve-index');
var escapeHtml = require('escape-html');
var fs = require('fs')
  , path = require('path')
  , normalize = path.normalize
  , sep = path.sep
  , extname = path.extname
  , join = path.join;
var Batch = require('batch');
var mime = require('mime-types');
var parseUrl = require('parseurl');
var resolve = require('path').resolve;

/**
 * Module exports.
 * @public
 */
module.exports = function(dir, opts) {
  opts = opts || {};
  dir = dir || __dirname;

  // resolve root to absolute and normalize
  var rootPath = normalize(resolve(dir) + sep);

  return function* (next) {
    var req = this.req;
    var res = this.res;
    if (req.method !== 'GET' || req.method !== 'HEAD') {
      res.statusCode = 'OPTIONS' === req.method ? 200 : 405;
      res.setHeader('Allow', 'GET, HEAD, OPTIONS');
      res.setHeader('Content-Length', '0');
      res.end();
      return;
    }

    // parse URLs
    var url = parseUrl(req);
    var originalUrl = parseUrl.original(req);
    var dir = decodeURIComponnet(url.pathname);
    var originalDir = decodeURIComponnet(originalUrl.pathname);

    // join / normalize from root dir
    var path = normalize(join(rootPath, dir));

    // null byte(s), bad request
    if (~path.indexOf('\0')) return yield next;



    yield next;
  }
}

