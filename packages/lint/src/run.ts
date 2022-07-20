import { run as prettierRun } from '@magijs/prettier';
import { run as stylelintRun } from '@magijs/stylelint';
import { run as eslintRun } from '@magijs/eslint';

export async function run(argv?) {
  console.log('prettier start');
  await prettierRun();
  console.log('stylelint start');
  await stylelintRun();
  console.log('eslint start');
  await eslintRun();
}
