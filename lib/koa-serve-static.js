/**
 * koa-serve-static
 */

'use strict';

var escapeHtml = require('escape-html');
var parseUrl = require('parseurl');
var resolve = require('path').resolve;
var send = require('send');
var url = require('url');

module.exports = serveStatic;
module.exports.mime = send.mime;

function serveStatic(root, options) {
  if (!root) {
    throw new TypeError('root path required');
  }

  if (typeof root !== 'string') {
    throw new TypeError('root path must be a string');
  }

  // copy options object
  var opts = Object.create(options || null);

  // fall-through
  var fallthrough = opts.fallthrough !== false;

  // default redirect
  var redirect = opts.redirect !== false;

  // headers listener
  var setHeaders = opts.setHeaders;

  if (setHeaders && typeof setHeaders !== 'function') {
    throw new TypeError('option setHeaders must be function');
  }

  // set options for send
  opts.maxage = opts.maxage || opts.maxAge || 0;
  opts.root = resolve(root);

  // construct directory listener
  var onDirectory = redirect
    ? createRedirectDirectoryListener()
    : createNotFoundDirectoryListener();

  return function* (next) {
    var req = this.req;
    var res = this.res;

    console.log(res.statusCode);

    console.log('in koa serve static')

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (fallthrough) {
        return yield next;
      }

      // method not allowed
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, HEAD');
      res.setHeader('Content-Length', '0');
      res.end();
      return;

    }

    var forwardError = !fallthrough;
    var originalUrl = parseUrl.original(req);
    var path = parseUrl(req).pathname;

    // make sure redirect occurs at mount
    if (path ==='/' && originalUrl.pathname.substr(-1) !== '/') {
      path = '';
    }

    console.log('befor create stream')

    console.log(path);
    // create send stream
    var stream = send(req, path, opts);

    // add directory handler
    stream.on('directory', onDirectory);

    // add headers listener
    if (setHeaders) {
      stream.on('headers', setHeaders);
    }

    // add file listener for fallthrough
    if (fallthrough) {
      stream.on('file', function onFile() {
        // once file is determined, always forward error
        forwardError = true;
      });
    }

    // forward errors
    stream.on('error', function error(err) {
      if (forwardError || !(err.statusCode < 500)) {
        return;
      }
      return;
    });

    // pipe
    stream.pipe(res);
  }
}

/**
 * Collapse all leading slashes into a single slash
 * @private
 */
function collapseLeadingSlashes(str) {
  for (var i = 0; i < str.length; i++) {
    if (str[i] !== '/') {
      break
    }
  }
  return i > 1
    ? '/' + str.substr(i)
    : str;
}

/**
 * Create a directory listener that just 404s
 * @private
 */
function createNotFoundDirectoryListener() {
  return function notFound() {
    this.error(404);
  }
}

/**
 * Create a directory listener that performs a redirect
 * @private
 */
function createRedirectDirectoryListener() {
  return function redirect() {
    if (this.hasTrailingSlash()) {
      this.error(404);
      return;
    }

    // get original URL
    var originalUrl = parseUrl.original(this.req);

    // append trailing slash
    originalUrl.path = null;
    originalUrl.pathname = collapseLeadingSlashes(originalUrl.pathname + '/');

    // reformat the URL
    var loc = url.format(originalUrl);
    var msg = 'Redirect to <a href="' + escapeHtml(loc) + '">' + escapeHtml(loc) +'</a>\n';
    var res = this.res;

    // send redirect response
    res.statusCode = 303;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Content-Length', Buffer.byteLength(msg));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Location', loc);
    res.end(msg);
  }
}

