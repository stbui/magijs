import { report } from './report';
import { exec as execStylelint } from './stylelint';
import { exec as execEslint } from './eslint';
import { exec as execPrettier } from './prettier';
import { exec as staged } from './lintstaged';



export function run() {
    const type = process.argv.slice(2);
    const argv = process.argv.slice(3);
    
    if (type.includes('report')) {
        report(argv);
    } else if (type.includes('stylelint')) {
        execStylelint(argv);
    } else if (type.includes('eslint')) {
        execEslint(argv);
    } else if (type.includes('prettier')) {
        execPrettier(argv);
    } else if (type.includes('staged')) {
        staged(argv);
    }
}
