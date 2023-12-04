import { fork } from 'child_process';
import { resolve } from 'path';

export function StagedExec(command: string[]) {
  const bin = resolve(require.resolve('lint-staged'), '../../bin/lint-staged');

  const child = fork(bin, command, {
    stdio: 'inherit',
  });

  child.on('exit', code => {
    process.exit(code || 0);
  });

  console.log('[zalint]', JSON.stringify(command));
}
