import { stylelintReport } from './stylelint-report';
import { exec } from './eslint';

export function report(argv: string[] = []) {
  const _argv = argv.length ? argv : ['src'];

  stylelintReport(_argv);

  const command = ['-f', 'checkstyle', '-o', 'report_zacc_eslint_js.xml'].concat(_argv);
  exec(command);
  console.log(`=> ./report_zacc_eslint_js.xml`);
}
