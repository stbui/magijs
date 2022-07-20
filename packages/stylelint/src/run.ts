import cli from 'stylelint//lib/cli';

export async function run() {
  const config = require.resolve('./config');
  await cli(['--config', config, 'src/**/*.scss']);
}
