import { fork } from 'child_process';
import { resolve } from 'path';

export function PrettierExec(command: string[]) {
  const prettier = resolve(require.resolve('prettier'), '../bin-prettier.js');

  const child = fork(prettier, command, {
    stdio: 'inherit',
  });

  child.on('exit', code => {
    process.exit(code || 0);
  });

  console.log('[zalint]', JSON.stringify(command));
}
