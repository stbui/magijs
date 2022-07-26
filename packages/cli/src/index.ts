import { run } from '@magijs/lint';
import { Middleware } from './umi4';

const args = process.argv.slice(2);

if (args.includes('component')) {
  // magi component xxxxx
  console.log('已关闭');
} else if (args.includes('lint')) {
  run(args);
} else {
  const { version } = require('../package');

  new Middleware({
    presets: '@magijs/preset-plugin',
    version,
  }).setup();
}
