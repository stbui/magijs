const fs = require('fs');
const stylelint = require('stylelint');
const checkstyleFormatter = require('stylelint-checkstyle-formatter');

import { join } from 'path';

export function stylelintReport(argv = ['src']) {
  const files = join(argv[0], '/**/*.scss');

  stylelint
    .lint({
      files: files,
      formatter: stylelintResults => {
        return checkstyleFormatter(stylelintResults);
      },
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
