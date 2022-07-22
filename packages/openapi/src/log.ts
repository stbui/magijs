import chalk from '@magijs/compiled/chalk';

export default (...rest) => console.log(`${chalk.blue('[openAPI]')}: ${rest.join('\n')}`);
