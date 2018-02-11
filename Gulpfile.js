/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * If applicable, add the following below this MPL 2.0 HEADER, replacing
 * the fields enclosed by brackets "[]" replaced with your own identifying
 * information:
 *     Portions Copyright [yyyy] [name of copyright owner]
 *
 *     Copyright 2017 Rosie Applications, Inc.
 *
 */
'use strict';

//==============================================================================
// Requires
//==============================================================================
const path  = require('path');

const gulp    = require('gulp');
const plumber = require('gulp-plumber');
const gutil   = require('gulp-util');

const webpack       = require('webpack');
const webpackStream = require('webpack-stream');

const browserSync = require('browser-sync').create();

//==============================================================================
// Source and Asset Paths
//==============================================================================
const staticHtmlFiles = [
  './src/content/**/*'
];

const staticCssFiles = [
  './src/css/**/*'
];

const jsSourceFiles = [
  './src/js/basic.js',
  './src/js/implicit.js',
  './src/js/mobile.js',
  './src/js/register.js'
];

const vendorChunks = [
  'jquery',
  'crypto-js'
];

const jsWatchFiles = [
  './src/js/*.js',
];

const allWatchPaths =
  [].concat(staticHtmlFiles, staticCssFiles, jsWatchFiles);

//==============================================================================
// Destination Paths
//==============================================================================
const buildDestPath     = 'dist';
const buildHtmlDestPath = `${buildDestPath}`;
const buildJsDestPath   = `${buildDestPath}/js`;
const buildCssDestPath  = `${buildDestPath}/css`;

//==============================================================================
// Proxy Settings
//==============================================================================
/**
 * This controls the hostname that the proxy masquerades as.
 *
 * You must add this hostname to your `/etc/hosts` file or your local DNS
 * in order for it to resolve.
 *
 * This is necessary because browser security prevents requests to OpenAM from
 * resolving correctly if the proxy was using the default host name of
 * https://localhost:3001.
 *
 * @type {string}
 */
const proxyHost = 'am-sample.local.example.com';

/**
 * This controls where the BrowserSync proxy serves up the sample app.
 *
 * The app does not need to be deployed on Tomcat when running through the
 * proxy, but this path must not conflict with any apps that *are* deployed
 * to Tomcat that the sample requires. In other words, setting this to
 * "/openam" would likely be a bad idea.
 *
 * @type {string}
 */
const proxySampleAppPath = '/openid-sample';

//==============================================================================
// Task Definitions
//==============================================================================
/**
 * Runs BrowserSync proxied to a remote OpenAM install.
 *
 * Changes to JS and HTML are automatically recognized and compiled, and then
 * automatically applied to the page.
 *
 * Required command-line options:
 *  - proxy-target: The URL or hostname of the remote OpenAM install, with or
 *                  without the protocol (i.e. "http://").
 */
gulp.task('am-proxy', ['package'], function() {
  const localRoutes = [
    {
      route: proxySampleAppPath,
      dir:   buildDestPath
    }];

  browserSync.init({
    proxy:        getProxyTarget(),
    serveStatic:  localRoutes,
    ghostMode:    false,
    host:         proxyHost,
    open:         'external',
    port:         3000,
    startPath:    proxySampleAppPath
  });

  return gulp.watch(allWatchPaths, ['package']);
});

/**
 * Invokes WebPack to package the application.
 */
gulp.task('package', ['copy-static'], function () {
  return gulp.src(jsSourceFiles)
    .pipe(plumber({
      errorHandler: showError
    }))
    .pipe(webpackStream({
      entry: generateChunkNames(),
      output: {
        filename:           '[name].bundle.js',
        sourceMapFilename:  '[name].bundle.js.map',
        library:            ['Page', '[name]'],
        libraryTarget:      'var'
      },
      devtool: 'source-map',
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: Infinity,
        }),
      ],
    }))
    .pipe(gulp.dest(buildJsDestPath))
    .pipe(browserSync.stream({once: true}));
});

/**
 * Copies all static HTML files into the `dist/` folder.
 */
gulp.task('copy-static-html', function() {
  return gulp.src(staticHtmlFiles)
    .pipe(gulp.dest(buildHtmlDestPath));
});

/**
 * Copies all static CSS files into the `dist/css` folder.
 */
gulp.task('copy-static-css', function() {
  return gulp.src(staticCssFiles)
    .pipe(gulp.dest(buildCssDestPath));
});

//==============================================================================
// Task Aliases
//==============================================================================
/**
 * Default task -- packages everything with Webpack.
 */
gulp.task('default', ['package']);

/**
 * Copies all CSS + HTML to the destination.
 */
gulp.task('copy-static', ['copy-static-html', 'copy-static-css']);

//==============================================================================
// Utility Functions
//==============================================================================
/**
 * Gets the target URL for the BrowserSync proxy.
 *
 * - If no protocol has been specified, it is assumed to be HTTP.
 * - If no proxy target option has been passed from the command-line, an error
 *   is raised.
 *
 * @returns {string}
 */
function getProxyTarget() {
  let targetUrl = gutil.env['proxy-target'];

  if (!targetUrl) {
    throw new gutil.PluginError({
      plugin:  'openid-sample',
      message: "Please provide '--proxy-target=https://NAME_OF_YOUR_AM_SERVER' when using 'am-proxy'."
    });
  }

  // Prepends the protocol if it's missing; assumes https
  if ((targetUrl.indexOf('://') === 0) && (targetUrl.indexOf('//') === 0)) {
    targetUrl = 'https://' + targetUrl;
  }

  return targetUrl;
}

/**
 * Notifies the friendly local developer that there is an issue.
 *
 * @param error
 *        The error message.
 */
function showError(error) {
  gutil.beep();
  console.log(error);
}

/**
 * Splits vendor sources for jQuery and other libs into their own chunk,
 * and then puts the JS for each part of this app into distinct chunks.
 *
 * @returns {{vendor: string[]}}
 */
function generateChunkNames() {
  let chunks = {
    vendor: vendorChunks
  };

  // Converts the filename into a chunk ("xyz.js" becomes chunk "xyz").
  jsSourceFiles.forEach(function(sourceFile) {
    let chunkName = path.basename(sourceFile, path.extname(sourceFile));

    chunks[chunkName] = sourceFile;
  });

  return chunks;
}
