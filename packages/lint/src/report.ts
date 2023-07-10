import { stylelintReport } from './stylelint-report';
import { exec } from './eslint';

export function report(argv: string[] = []) {
  stylelintReport();

  const _argv = argv.length ? argv : ['src'];

  const command = ['-f', 'checkstyle', '-o', 'report_zacc_eslint_js.xml'].concat(_argv);
  exec(command);
  console.log(`=> ./report_zacc_eslint_js.xml`);
}
