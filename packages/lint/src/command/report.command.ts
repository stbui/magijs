import { Command, Option, Action } from '@stbui/one-common';
import { EslintExec, StylelintReport } from '../exec';

@Command({
  name: 'report',
  description: 'report 静态扫描',
  example: {
    command: 'zalint report -d src',
    description: '静态扫描',
  },
})
export class ReportCommand {
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
    const command = [
      '--config',
      require.resolve('../config/eslint'),
      '--ext',
      'ts,tsx,js,jsx',
      this.dir,
      '-f',
      'checkstyle',
      '-o',
      'report_zacc_eslint_js.xml',
    ];

    EslintExec(command);
    console.log(`=> ./report_zacc_eslint_js.xml`);

    //
    StylelintReport(this.dir);
  }
}
