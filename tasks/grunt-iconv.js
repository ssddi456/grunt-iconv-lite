/*
 * y
 * 
 *
 * Copyright (c) 2013 ssddi456
 * Licensed under the MIT license.
 */

'use strict';

var iconvLite = require('iconv-lite');
var _         = require('underscore');
var path      = require('path');

module.exports = function(grunt) {

  function detectDestType (dest) {
    if (grunt.util._.endsWith(dest, path.sep)) {
      return 'directory';
    } else {
      return 'file';
    }
  };

  function unixifyPath (filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

  grunt.registerMultiTask('grunt-iconvLite', 'trans encoding', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      fromEncoding : 'utf8',
      toEncoding   : 'gb2312'
    });
    
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var isExpandedPair = f.orig.expand || false;
      // Concat specified files.
      f.src.filter(function(src) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(src)) {
          grunt.log.warn('Source file "' + src + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(src) {
        var dest;
        if (detectDestType(f.dest) === 'directory') {
          dest = (isExpandedPair) ? f.dest : unixifyPath(path.join(f.dest, src));
        } else {
          dest = f.dest;
        }

        if (grunt.file.isDir(src)) {
          // grunt.log.writeln('Creating ' + dest.cyan);
          grunt.file.mkdir(dest);
        } else {
          // grunt.log.writeln('Copying ' + src.cyan + ' -> ' + dest.cyan);
          // Read file source.
          grunt.file.copy(src, dest, {
            encoding : options.fromEncoding,
            process  : function( content ){
              return iconvLite.encode(new Buffer(content),options.toEncoding);
            }
          });
          // Print a success message.
          grunt.log.writeln('File "' + f.dest + '" transed.');
        }
      });

    });
  });

};
