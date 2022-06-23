import chalk from 'chalk';

export default (...rest) => console.log(`${chalk.blue('[openAPI]')}: ${rest.join('\n')}`);
