import shelljs from 'shelljs';

export function exec(argv) {
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
}
