import { ESLint } from 'eslint';

export async function run() {
  const config = require('./config');

  const eslint = new ESLint({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    baseConfig: config,
  });

  const results = await eslint.lintFiles(['src/**/*.ts']);
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  console.log(resultText);
}
