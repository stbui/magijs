import { fork } from 'child_process';
import { resolve } from 'path';

export function cli(command: string[]) {
  const prettier = resolve(require.resolve('prettier'), '../bin-prettier.js');

  fork(prettier, command, {
    stdio: 'inherit',
  });

  console.log('[magi][eslint]', command);
}

export function exec(argv: string[] = []) {
  const _argv = argv.length ? argv : ['src'];

  const defaultCommand = [
    '--config',
    require.resolve('./config/eslint'),
    '--write',
    'src/**/*.{js,jsx,tsx,ts,scss,json}',
  ].concat(_argv);

  cli(defaultCommand);
}
