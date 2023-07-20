import { fork } from 'child_process';
import { resolve } from 'path';

export function cli(command: string[]) {
  const prettier = require.resolve('prettier');

  fork(prettier, command, {
    stdio: 'inherit',
  });

  console.log('[magi][zalint]', command);
}

export function exec(argv: string[] = []) {
  let _argv = argv;

  if (argv.length === 0) {
    _argv = ['src/**/*.{js,jsx,tsx,ts,scss,json}'];
  } else {
    _argv = [argv[0] + '/**/*.{css,scss}'].concat(argv.slice(1));
  }

  const defaultCommand = ['--config', require.resolve('./config/prettier'), '--write'].concat(_argv);

  cli(defaultCommand);
}
