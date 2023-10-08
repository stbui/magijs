import { fork } from 'child_process';
import { resolve } from 'path';

export function EslintExec(command: string[]) {
  const eslint = resolve(require.resolve('eslint'), '../../bin/eslint.js');

  fork(eslint, command, {
    stdio: 'inherit',
  });

  console.log('[zalint]', JSON.stringify(command));
}
