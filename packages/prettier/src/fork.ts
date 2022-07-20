import { fork as originFork } from 'child_process';
import { resolve } from 'path';
import { tryGetConfig } from './tryGetConfig';

export const config = () => {
  const cwd = process.cwd();
  const defaultPrettierFilePath = require.resolve('./config');
  const prettierConfig = tryGetConfig(cwd, '.prettierrc') || defaultPrettierFilePath;

  return prettierConfig;
};

export function fork() {
  const prettierConfig = config();
  const prettier = resolve(require.resolve('prettier'), '../bin-prettier.js');

  originFork(prettier, ['--config', prettierConfig, '--write', 'src/**/*.{js,jsx,tsx,ts,scss,json}']);
}
