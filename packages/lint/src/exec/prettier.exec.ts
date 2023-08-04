import { fork } from 'child_process';

export function PrettierExec(command: string[]) {
  const prettier = require.resolve('prettier');

  fork(prettier, command, {
    stdio: 'inherit',
  });

  console.log('[magi][zalint]', JSON.stringify(command));
}
