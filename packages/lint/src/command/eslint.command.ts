import { Command, Option, Action } from '@stbui/one-common';
import { EslintExec } from '../exec/eslint.exec';

@Command({
  name: 'eslint',
  description: 'eslint 静态扫描',
  example: {
    command: 'zalint eslint -d src --fix',
    description: '静态扫描',
  },
})
export class EslintCommand {
  @Option({
    alias: 'd',
    description: '指定目录，默认src目录',
  })
  dir: string = 'src';

  @Option({
    alias: 'fix',
    description: '修复代码',
  })
  fix: boolean = false;

  constructor() {}

  @Action()
  run() {
    const command = ['--config', require.resolve('../config/eslint'), '--ext', 'ts,tsx,js,jsx', this.dir];

    if (this.fix) {
      command.push('--fix');
    }

    EslintExec(command);
  }
}
