import cli from 'prettier/cli';

export async function run() {
  const config = require.resolve('./config');

  await cli.run(['--config', config, '--write', 'src/**/*.{js,jsx,tsx,ts,scss,json}']);
}
