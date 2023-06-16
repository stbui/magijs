import { report } from './report';
import shelljs from 'shelljs';

const argv = process.argv.slice(2);

if (argv.includes('report')) {
  report(argv);
} else if (argv.includes('stylelint')) {
  // stylelint **/*.css **/*.scss --syntax scss
  const styCmd = ['stylelint', '**/*.css', '**/*.scss', '--syntax', 'scss'].join(' ');

  console.log('[magi][stylelint]', styCmd);
  shelljs
    .exec(styCmd, {
      async: true,
    })
    .stdout.on('data', chunk => {
      console.log(chunk);
    });
} else if (argv.includes('eslint')) {
  const esCmd = ['', '--ext', 'ts,tsx,js,jsx'];
  const cmd = argv.join(' ') + esCmd.join(' ');

  console.log('[magi][eslint]', cmd);
  shelljs
    .exec(cmd, {
      async: true,
    })
    .stdout.on('data', chunk => {
      console.log(chunk);
    });
} else if (argv.includes('prettier')) {
  // prettier --write 'client/**/*.{js,jsx,tsx,ts,less,md,json}'
  const pCmd = ['prettier', '--write', '**/*.{js,jsx,tsx,ts,less,scss,json}'].join(' ');

  console.log('[magi][prettier]', pCmd);
  shelljs
    .exec(pCmd, {
      async: true,
    })
    .stdout.on('data', chunk => {
      console.log(chunk);
    });
}
