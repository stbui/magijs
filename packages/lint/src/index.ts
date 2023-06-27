export * from './verifyCommit';
export * from './report';
export * from './run';

export * from './stylelint-report';

import { exec as execStylelint } from './stylelint';
import { exec as execEslint } from './eslint';
import { exec as execPrettier } from './prettier';

export { execStylelint, execEslint, execPrettier };
