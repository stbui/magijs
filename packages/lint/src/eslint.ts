import { fork } from 'child_process';
import { resolve } from 'path';

export function cli(command: string[]) {
  const eslint = resolve(require.resolve('eslint'), '../../bin/eslint.js');

  fork(eslint, command, {
    stdio: 'inherit',
  });

  console.log('[magi][eslint]', command);
}

export function exec(argv: string[] = []) {
  const _argv = argv.length ? argv : ['src'];

  const defaultCommand = ['--ext', 'ts,tsx,js,jsx', '-c', require.resolve('./config/eslint')].concat(_argv);

  cli(defaultCommand);
}
