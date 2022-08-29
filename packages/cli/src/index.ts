import { run as runLint } from '@magijs/lint';
import { run as runCli } from './cli';

const args = process.argv.slice(2);

if (args.includes('component')) {
  // magi component xxxxx
  console.log('已关闭');
} else if (args.includes('lint')) {
  runLint(args);
} else {
  runCli();
}
