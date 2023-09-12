import { Command, Option, Action } from '@stbui/one-common';
import { PrettierExec } from '../exec/prettier.exec';
import { copyFileSync } from 'fs';
import { join } from 'path';

@Command({
  name: 'prettier',
  description: 'prettier 静态扫描',
  example: {
    command: 'zalint prettier -d src',
    description: '静态扫描',
  },
})
export class PrettierCommand {
  @Option({
    alias: 'd',
    description: '指定目录，默认src目录',
  })
  dir: string = 'src';

  constructor() {}

  @Action()
  run() {
    const command = [
      '--config',
      require.resolve('../config/prettier'),
      '--write',
      `${this.dir}/**/*.{js,jsx,tsx,ts,scss,json}`,
    ];

    //
    try {
      const APP = process.cwd();
      const APP_CONFIG_PATH = join(APP, './.prettierrc.js');
      copyFileSync(command[1], APP_CONFIG_PATH);
    } catch (e) {
      // console.log('[magi][zalint]', 'zalint.json配置文件不存在');
    }

    PrettierExec(command);
  }
}