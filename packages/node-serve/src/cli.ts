import fs from 'fs';
import minimist from '@magijs/compiled/minimist';
import path from 'path';
import { NodeProxy } from './proxy';

function getConfigFile(pathFile) {
  const configFile = path.join(process.cwd(), pathFile);

  if (fs.existsSync(configFile)) {
    return fs.readFileSync(configFile);
  }
  return {};
}

function start(config) {
  const DEPLOY_ENV = config.env || process.env.DEPLOY_ENV || 'prd';
  const proxy = getConfigFile(config.configFile)[DEPLOY_ENV];

  new NodeProxy({
    proxy: proxy,
    static: config.static,
    publicPath: config.publicPath,
  });
}

const args = minimist(process.argv.slice(2));

start({
  configFile: args.c || './config/proxy-config.json',
  static: args.o,
});
