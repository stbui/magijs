import { fork } from 'child_process';
import { writeFileSync } from 'fs';
import { join, resolve } from 'path';

const configPath = join(__dirname, '.lintstagedrc.json');

export function exec(command: string[] = []) {
  const eslintConfig = require.resolve('./config/eslint');
  const stylelintConfig = require.resolve('./config/stylelint');
  const prettierConfig = require.resolve('./config/prettier');

  const dir = command.length ? command : ['src'];

  const config = {
    [`${dir[0]}/**/*.{js,jsx,ts,tsx,scss,json}`]: [`prettier --config ${prettierConfig}  --write`, 'git add'],
    [`${dir[0]}/**/*.{css,scss,less}`]: [`stylelint --config ${stylelintConfig} --fix`, 'git add'],
    [`${dir[0]}/**/*.{js,jsx,tsx,ts}`]: [`eslint -c ${eslintConfig} --fix`, 'git add'],
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });

  console.log('[magi][staged]', config);
  const cli = resolve(require.resolve('lint-staged'), '../../bin/lint-staged');
  fork(cli, ['-c', configPath], {
    stdio: 'inherit',
  });
}
