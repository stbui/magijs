import { CLIEngine } from 'eslint';

export const formatter = () => {
  const config = require('./config');

  const cli = new CLIEngine({
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    baseConfig: config,
  });

  const reportFiles = cli.executeOnFiles(['src']);
  const formatter = cli.getFormatter('checkstyle');

  return formatter(reportFiles.results);
};
