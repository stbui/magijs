import { run } from '@magijs/lint';
import { Through } from './umi4';

const args = process.argv.slice(2);

if (args.includes('component')) {
  // magi component xxxxx
  console.log('已关闭');
} else if (args.includes('lint')) {
  run(args);
} else {
  const { version } = require('../package');

  new Through({
    presets: '@magijs/preset-plugin',
    version,
  }).setup();
}
