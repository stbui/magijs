import { run as eslintRun } from '@magijs/eslint';
import { run as prettierRun } from '@magijs/prettier';
import { run as stylelintRun } from '@magijs/stylelint';
import { report } from './report';

export async function run(argv?) {
  // if (argv === 'stylelint') {
  //   console.log('[magi]:', '开始执行 stylelint');
  //   await stylelintRun();
  // }

  // if (argv === 'eslint') {
  //   console.log('[magi]:', '开始执行 eslint');
  //   await eslintRun();
  // }

  // if (argv === 'eslint') {
  //   console.log('[magi]:', '开始执行 prettier');
  //   await prettierRun();
  // }

  if (argv.includes('--report')) {
    report();
    return;
  }

  console.log('[magi]:', '开始执行 prettier');
  await prettierRun();

  console.log('[magi]:', '开始执行 stylelint');
  await stylelintRun();

  console.log('[magi]:', '开始执行 eslint');
  await eslintRun();
}
