import { readFileSync, existsSync } from 'fs';
import path from 'path';
var ini = require('./ini');

function format(data) {
  var out = {};
  Object.keys(data).forEach(function (k) {
    if (k.indexOf('"') > -1) {
      var parts: any = k.split('"');
      var parentKey = parts.shift().trim();
      var childKey = parts.shift().trim();
      if (!out[parentKey]) out[parentKey] = {};
      out[parentKey][childKey] = data[k];
    } else {
      // @ts-ignore
      out[k] = merge(out[k], data[k]);
      // cant start using these without bumping the major
      //out[k] = {...out[k], ...data[k]};
    }
  });
  return out;
}

function findGit(dir, options, cb) {
  var folder = path.resolve(dir, options.gitDir || process.env.GIT_DIR || '.git', 'config');

  const exists = existsSync(folder);

  if (exists) {
    return cb(folder);
  }

  if (dir === path.resolve(dir, '..')) {
    return cb(false);
  }

  findGit(path.resolve(dir, '..'), options, cb);
}

function merge() {
  var a = {};
  for (var i = arguments.length; i >= 0; --i) {
    Object.keys(arguments[i] || {}).forEach(k => {
      a[k] = arguments[i][k];
    });
  }
  return a;
}

export default function (dir, options, cb?) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  findGit(dir, options, function (config) {
    if (!config) return cb(new Error('no gitconfig to be found at ' + dir));

    const data = readFileSync(config);
    try {
      let formatted = format(ini.parse(data.toString()));
      cb(false, formatted);
    } catch (e) {
      return cb(e);
    }
  });
}
