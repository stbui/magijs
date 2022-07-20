import { fork as originFork } from 'child_process';
import { resolve } from 'path';
import { tryGetConfig } from './tryGetConfig';

export const config = () => {
  const cwd = process.cwd();
  const defaultStyleLintFilePath = require.resolve('./config');
  const stylelintConfig = tryGetConfig(cwd, '.stylelintrc') || defaultStyleLintFilePath;

  return stylelintConfig;
};

export function fork() {
  const stylelintConfig = config();
  const stylelint = resolve(require.resolve('stylelint'), '../../bin/stylelint.js');

  originFork(stylelint, ['--config', stylelintConfig, '--syntax', 'scss']);
}
