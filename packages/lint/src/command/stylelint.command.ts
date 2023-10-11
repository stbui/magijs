import { Command, Option, Action } from '@stbui/one-common';
import { StylelintExec } from '../exec';

@Command({
  name: 'stylelint',
  description: 'stylelint 静态扫描',
  example: {
    command: 'zalint stylelint -d src --fix',
    description: '静态扫描',
  },
})
export class StylelintCommand {
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
    const command = ['--config', require.resolve('../config/stylelint'), `${this.dir}/**/*.{css,scss}`];

    if (this.fix) {
      command.push('--fix');
    }

    StylelintExec(command);
  }
}
