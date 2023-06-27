import { report } from './report';
import { exec as execStylelint } from './stylelint';
import { exec as execEslint } from './eslint';
import { exec as execPrettier } from './prettier';

const argv = process.argv.slice(2);

if (argv.includes('report')) {
  report(argv);
} else if (argv.includes('stylelint')) {
  execStylelint(argv);
} else if (argv.includes('eslint')) {
  execEslint(argv);
} else if (argv.includes('prettier')) {
  execPrettier(argv);
}
