const fs = require('fs');
const stylelint = require('stylelint');
const checkstyleFormatter = require('stylelint-checkstyle-formatter');

export function stylelintReport() {
  const REPORT_FILE = 'report_zacc_stylelint_css.xml';
  stylelint
    .lint({
      files: '**/*.scss',
      formatter: stylelintResults => {
        return checkstyleFormatter(stylelintResults);
      },
      syntax: 'scss',
      config: {
        extends: 'stylelint-config-za',
      },
    })
    .then(result => {
      fs.writeSync(fs.openSync(REPORT_FILE, 'w'), result.output);
      console.log(`=> ./${REPORT_FILE}`);
    });
}
