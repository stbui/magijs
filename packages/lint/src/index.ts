export * from './verifyCommit';
export * from './report';
export * from './stylelint-report';
export * from './run';

import { exec as execStylelint } from './stylelint';
import { exec as execEslint } from './eslint';
import { exec as execPrettier } from './prettier';
import { exec as execStaged } from './lintstaged';

export { execStylelint, execEslint, execPrettier, execStaged };
