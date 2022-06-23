import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { NodeProxy } from './proxy';

function start(config) {
  const DEPLOY_ENV = config.env || process.env.DEPLOY_ENV || 'prd';
  const configFile = path.join(process.cwd(), config);

  const configContent = fs.readFileSync(configFile);
  // const proxyConfig = { dev: {}, test: {} };
  const proxyContent = configContent[DEPLOY_ENV];

  new NodeProxy({
    proxy: proxyContent,
    static: config.static,
    publicPath: config.publicPath,
  });
}

const args = minimist(process.argv.slice(2));

start({
  configFile: args.c || './config/proxy-config.json',
  static: args.o,
});
