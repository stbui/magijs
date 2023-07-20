import { fork } from 'child_process';
import { resolve } from 'path';

export function cli(command: string[]) {
  const bin = resolve(require.resolve('stylelint'), '../../bin/stylelint.js');

  fork(bin, command, {
    stdio: 'inherit',
  });

  console.log('[magi][zalint]', command);
}

export function exec(argv: string[] = []) {
  let _argv = argv;

  if (argv.length === 0) {
    _argv = ['src/**/*.{css,scss}'];
  } else if (argv[0] === '--fix') {
    _argv = ['src/**/*.{css,scss}'].concat(argv);
  } else {
    _argv = [argv[0] + '/**/*.{css,scss}'].concat(argv.slice(1));
  }

  const defaultCommand = ['--config', require.resolve('./config/stylelint'), '**/*.{css,scss}'].concat(argv);

  cli(defaultCommand);
}
