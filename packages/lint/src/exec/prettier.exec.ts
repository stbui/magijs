import { fork } from 'child_process';
import { resolve } from 'path';

export function PrettierExec(command: string[]) {
  const prettier = resolve(require.resolve('prettier'), '../bin/prettier.cjs');

  fork(prettier, command, {
    stdio: 'inherit',
  });

  console.log('[magi][zalint]', JSON.stringify(command));
}
