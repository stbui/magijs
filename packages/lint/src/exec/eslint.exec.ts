import { fork } from 'child_process';
import { resolve } from 'path';

export function EslintExec(command: string[]) {
  const eslint = resolve(require.resolve('eslint'), '../../bin/eslint.js');

  const child = fork(eslint, command, {
    stdio: 'inherit',
  });

  child.on('exit', code => {
    process.exit(code || 0);
  });

  console.log('[zalint]', JSON.stringify(command));
}
