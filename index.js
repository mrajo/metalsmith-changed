var p = require('path');
var fs = require('fs');
var debug = require('debug')('metalsmith-changed');


/**
 * Only build if dest file is older then src file.
 */

module.exports = function(options){
  options = options || {};
  var force = options.force || false;
  var extnames = options.extnames || {};


  return function drafts(files, metalsmith, done){
    if (force) {
      // do nothing
      debug('force: true, building all files');
      return;
    }
    for (var file in files) {
      debug('checking file %s', file);
      var extnameSrc = p.extname(file);
      var extnameDst = extnames[extnameSrc] || extnameSrc;
      var fileDst = p.join(p.dirname(file), p.basename(file, extname) + extnameOut);
      try {
        var statSrc = fs.statSync(file);
        var statDst = fs.statSync(fileDst);
      } catch (e) {
        // dst file does not exist
        debug(e);
        continue;
      }
      if (statDst.ctime.getTime() >= statSrc.ctime.getTime()) {
        // dst file is newer than src file
        debug('not building %s', file);
        delete files[file];
      }
    }
    done();
  };
}