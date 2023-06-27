import shelljs from 'shelljs';

export function exec(argv) {
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
