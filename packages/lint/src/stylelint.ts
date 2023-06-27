import shelljs from 'shelljs';

export function exec(argv) {
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
}
