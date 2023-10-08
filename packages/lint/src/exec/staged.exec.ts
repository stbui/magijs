import { fork } from 'child_process';
import { resolve } from 'path';

export function StagedExec(command: string[]) {
  const bin = resolve(require.resolve('lint-staged'), '../../bin/lint-staged');

  fork(bin, command, {
    stdio: 'inherit',
  });

  console.log('[zalint]', JSON.stringify(command));
}
