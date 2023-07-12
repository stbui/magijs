import { run as runLint } from '@magijs/lint';
import { run as runCli } from './cli';

const args = process.argv.slice(2);

if (args.includes('component')) {
  // magi component xxxxx
  console.log('已关闭');
} else if (args.includes('lint')) {
  runLint();
} else {
  let presets = [require.resolve('./preset')];

  try {
    // vue
    const vue = require.resolve('vue');
    presets = [require.resolve('@magijs/preset-plugin/lib/ship'), require.resolve('@umijs/preset-vue')];
  } catch (e) {
    // react
    presets = [require.resolve('./preset')];
  }

  runCli({ presets });
}
