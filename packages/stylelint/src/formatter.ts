import checkstyleFormatter from 'stylelint-checkstyle-formatter';
import stylelint from 'stylelint';

export const formatter = () => {
  const config = require('./config');

  return stylelint.lint({
    files: 'src/**/*.scss',
    formatter: stylelintResults => checkstyleFormatter(stylelintResults),
    // syntax: 'scss',
    config: config,
  });
};
