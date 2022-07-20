import { writeFileSync } from 'fs';
import { formatter as stylelintStyle } from '@magijs/stylelint';
import { formatter as eslintStyle } from '@magijs/eslint';

export function report() {
  const formatter = eslintStyle();
  writeFileSync('report_zacc_eslint_js.xml', formatter, { encoding: 'utf-8' });

  stylelintStyle().then(result => {
    writeFileSync('report_zacc_stylint_css.xml', result.output, { encoding: 'utf-8' });
  });
}
