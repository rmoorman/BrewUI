/*
 * Main
 */

var path = require('path');
var fs = require('fs');

var debug = require('debug')('BrewUI');
var Promise = require('bluebird');

var gulpfile = require('./gulpfile');
var pkg = require('./package.json');


/*
 * Build
 *
 * @method build
 * @param {String} distPath
 * @param {Boolean} force optional
 * @return {Promise}
 */
function build(distPath, force) {
  var manifestPath = path.join(distPath, 'manifest.json');

  return new Promise(function (resolve, reject) {
    var manifest;

    // Manifest exists
    if(fs.existsSync(manifestPath)) {
      manifest = require(manifestPath);
    }

    // Do not build if the same version and not forced
    if(force !== true && manifest && manifest.version === pkg.version) {
      debug('Already built');
      return resolve();
    }

    debug('Start build');
    gulpfile.build(distPath, function (err) {
      if(err) {
        debug('Build error', err);
        return reject(err);
      }

      debug('Build is done');
      resolve();
    });
  });
}


/*
 * Extent to isomorphic
 *
 * requires jsx support
 */
function extendToIsomorphic () {
  debug('Generate Isomorphic interfaces: .app, .client');

  exports.app = require('./src/scripts/app/app');
  exports.client = require('./src/scripts/client/client');
}

// Main interface
exports.build = build;
exports.routes = require('./src/scripts/app/config/routes');
exports.isomorphic = extendToIsomorphic;
