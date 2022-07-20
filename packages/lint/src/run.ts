import { run as prettierRun } from '@magi/prettier';
import { run as stylelintRun } from '@magi/stylelint';
import { run as eslintRun } from '@magi/eslint';

export async function run(argv?) {
  console.log('prettier start');
  await prettierRun();
  console.log('stylelint start');
  await stylelintRun();
  console.log('eslint start');
  await eslintRun();
}
