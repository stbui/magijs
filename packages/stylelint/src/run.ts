import cli from 'stylelint/lib/cli';
// import cli from '@magijs/compiled/stylelint';

export async function run() {
  const config = require.resolve('./config');
  await cli(['--config', config, '--fix', 'src/**/*.scss', '--custom-syntax', 'postcss-scss']);
}
