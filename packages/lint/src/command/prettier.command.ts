import { Command, Option, Action } from '@stbui/one-common';
import { copyFileSync } from 'fs';
import { join } from 'path';
import { PrettierExec } from '../exec';

@Command({
  name: 'prettier',
  description: 'prettier 代码格式化',
  example: {
    command: 'zalint prettier -d src',
    description: '代码格式化',
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
