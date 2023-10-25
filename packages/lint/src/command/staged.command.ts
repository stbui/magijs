import { Command, Option, Action } from '@stbui/one-common';
import { join } from 'path';
import { writeFileSync } from 'fs';

import { StagedExec } from '../exec';

@Command({
  name: 'staged',
  description: 'staged 静态扫描',
  example: {
    command: 'zalint staged -d src',
    description: '静态扫描',
  },
})
export class StagedCommand {
  @Option({
    alias: 'd',
    description: '指定目录，默认src目录',
  })
  dir: string = 'src';

  @Option({
    alias: 'fix',
    description: '按照配置规则修复代码',
  })
  fix: boolean = false;

  constructor() {}

  @Action()
  run() {
    const configPath = join(__dirname, '.lintstagedrc.json');
    const eslintConfig = require.resolve('../config/eslint');
    const stylelintConfig = require.resolve('../config/stylelint');
    const prettierConfig = require.resolve('../config/prettier');

    const dir = this.dir;
    const fix = this.fix ? '--fix' : '';

    const config = {
      [`${dir}/**/*.{js,jsx,ts,tsx,scss,json}`]: [`prettier --config ${prettierConfig} --write`, 'git add'],
      [`${dir}/**/*.{css,scss,less}`]: [`stylelint --config ${stylelintConfig} ${fix}`, 'git add'],
      [`${dir}/**/*.{js,jsx,tsx,ts}`]: [`eslint -c ${eslintConfig} ${fix}`, 'git add'],
    };

    writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });

    const command = ['-c', configPath];
    StagedExec(command);
  }
}
