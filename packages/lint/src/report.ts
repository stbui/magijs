import { formatter as eslintStyle } from '@magijs/eslint';
import { formatter as stylelintStyle } from '@magijs/stylelint';
import { writeFileSync } from 'fs';

export function report() {
  eslintStyle().then(result => {
    writeFileSync('report_zacc_eslint_js.xml', result, { encoding: 'utf-8' });
  });

  stylelintStyle().then(result => {
    writeFileSync('report_zacc_stylint_css.xml', result.output, { encoding: 'utf-8' });
  });
}
