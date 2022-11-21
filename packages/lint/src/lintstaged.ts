import { fork } from 'child_process';
import { writeFileSync } from 'fs';
import { join, resolve } from 'path';

const configPath = join(__dirname, './lintstagedrc.json');

function createConfig() {
  const eslintConfig = require.resolve('@magijs/eslint/lib/config');
  const prettierConfig = require.resolve('@magijs/prettier/lib/config');
  const stylelintConfig = require.resolve('@magijs/stylelint/lib/config');

  const config = {
    'src/**/*.{css,scss,less}': [`stylelint --config ${stylelintConfig} --fix`, 'git add'],
    'src/**/*.{js,jsx,tsx,ts}': [`eslint -c ${eslintConfig} --fix`, 'git add'],
    'src/**/*.{js,jsx,ts,tsx,scss,json}': [`prettier --config ${prettierConfig}  --write`, 'git add'],
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
  try {
    const cli = resolve(require.resolve('lint-staged'), '../../bin/lint-staged.js');
    fork(cli, ['-c', configPath], {
      stdio: 'inherit',
    });
  } catch (e) {
    console.log('lint-staged 要求node 14， 暂时关闭');
  }
}

createConfig();
