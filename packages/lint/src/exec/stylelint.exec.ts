import { fork } from 'child_process';
import { resolve, join } from 'path';
import fs from 'fs';
import stylelint from 'stylelint';
import checkstyleFormatter from 'stylelint-checkstyle-formatter';

/**
 *
 * @param command
 */
export function StylelintExec(command: string[]) {
  const bin = resolve(require.resolve('stylelint'), '../../bin/stylelint.js');

  const child = fork(bin, command, {
    stdio: 'inherit',
  });

  child.on('exit', code => {
    process.exit(code || 0);
  });

  console.log('[zalint]', JSON.stringify(command));
}

/**
 *
 * @param dir
 */
export function StylelintReport(dir: string) {
  const files = join(dir, '/**/*.scss');

  stylelint
    .lint({
      files: files,
      formatter: stylelintResults => checkstyleFormatter(stylelintResults),
      syntax: 'scss',
      config: {
        extends: 'stylelint-config-za',
      },
    })
    .then(result => {
      const REPORT_FILE = 'report_zacc_stylelint_css.xml';

      fs.writeSync(fs.openSync(REPORT_FILE, 'w'), result.output);
      console.log(`=> ./${REPORT_FILE}`);
    });
}
