var concat = require('broccoli-concat'),
  pickFiles = require('broccoli-static-compiler'),
  compileSass = require('broccoli-sass'),
  findBowerTrees = require('broccoli-bower'),
  compileES6 = require('broccoli-es6-concatenator'),
  mergeTrees = require('broccoli-merge-trees');

  var app = 'app';
  app = pickFiles(app, {
      srcDir: '/',
        destDir: 'appkit' // move under appkit namespace
  });

  var styles = 'styles';
  styles = pickFiles(styles, {
      srcDir: '/',
        destDir: 'appkit'
  });

  var vendor = 'vendor'

  var sourceTrees = [app, styles, vendor];
  sourceTrees = sourceTrees.concat(findBowerTrees());

  var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true })

  var appJs = compileES6(appAndDependencies, {
    loaderFile: 'loader.js',
    inputFiles: [
      'appkit/**/*.js'
    ],
    legacyFilesToAppend: [
      'jquery.js'
    ],
    outputFile: '/assets/app.js'
  });

  var appCss = compileSass(sourceTrees, 'appkit/style.scss', 'assets/app.css')

  var publicFiles = 'public';

  module.exports = mergeTrees([appJs, appCss, publicFiles]);
