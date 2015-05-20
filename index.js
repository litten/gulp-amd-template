var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var beautify = require('js-beautify');
var EOL = '\n';
var compileTmpl = require('micro-tpl');

module.exports = function (options) {

    // default options
    var opts = _.defaults(_.clone(options) || {}, {
        // use lodash/underscore compiler by default
        compiler: _.template
    });

    return through.obj(function (file, encoding, next) {
        if (file.isNull()) {
            return next(null, file);
        }

        if (file.isStream()) {
            // emit error, but keep processing
            this.emit('error', new gutil.PluginError('compile', 'Streaming not supported'));
            return next();
        }

        if (file.isBuffer()) {
            // compile template source into JS function
            var template = file.contents.toString();
            //var compiled = opts.compiler(template);
            var compiled = compileTmpl(template, {
                path: file.path
            });

            var str = file.relative;
            var strArr = str.split("/");
            var last = strArr[strArr.length - 1];
            var fileName = (last.split("."))[0];

            var head = ([
                "(function (root, factory) {",
                "  if (typeof define === 'function' && define.amd) {",
                "    define(factory);",
                "  } else {",
                "    root['" + fileName + "'] = factory();",
                "  }",
                "}(this, function (){",
                "  return "
            ]).join(EOL);

            var foot = ([
                "",
                "}));"
            ]).join(EOL);
            
            compiled = head + compiled + foot;
            // transform compiled JS function into source code string
            file.contents = new Buffer(compiled.toString());

            // rename file to .js extension
            file.path = gutil.replaceExtension(file.path, '.js');
        }

        // pass (potentially) compiled template along
        next(null, file);
    });

};
