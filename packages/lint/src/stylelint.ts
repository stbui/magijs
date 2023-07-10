import { fork } from 'child_process';
import { resolve } from 'path';

export function cli(command: string[]) {
  const bin = resolve(require.resolve('stylelint'), '../../bin/stylelint.js');

  fork(bin, command, {
    stdio: 'inherit',
  });

  console.log('[magi][stylelint]', command);
}

export function exec(argv: string[] = []) {
  const defaultCommand = [
    '**/*.css',
    '**/*.scss',
    '--syntax',
    'scss',
    '--config',
    require.resolve('./config/stylelint'),
  ].concat(argv);

  cli(defaultCommand);
}
