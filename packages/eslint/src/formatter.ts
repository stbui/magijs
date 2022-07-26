import { ESLint } from 'eslint';

export async function formatter() {
  const config = require('./config');

  const cli = new ESLint({
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    baseConfig: config,
  });

  const results = await cli.lintFiles(['src/**/*.ts']);
  const formatter = await cli.loadFormatter('checkstyle');
  const resultText = formatter.format(results);

  return resultText;
}
