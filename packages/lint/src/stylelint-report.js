const fs = require('fs');
const stylelint = require('stylelint');
const checkstyleFormatter = require('stylelint-checkstyle-formatter');

export function stylelintReport(arg = ['src']) {
  stylelint
    .lint({
      files: arg[0] + '**/*.scss',
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
