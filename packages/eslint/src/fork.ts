import { fork as originFork } from 'child_process';
import { resolve } from 'path';
import { tryGetConfig } from './tryGetConfig';

export const config = () => {
  const cwd = process.cwd();
  const defaultEslintFilePath = require.resolve('./config');
  const eslintConfig = tryGetConfig(cwd, '.eslintrc') || defaultEslintFilePath;

  return eslintConfig;
};

export function fork() {
  const eslintConfig = config();
  const eslint = resolve(require.resolve('eslint'), '../../bin/eslint.js');

  // 未测试
  originFork(eslint, [`--ext .js, .jsx, .ts, .tsx ${eslintConfig}`]);
}
