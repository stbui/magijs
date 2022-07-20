import { run } from './run';
import { report } from './report';

const argv = process.argv.slice(2);

if (argv.includes('--report')) {
  report();
} else {
  run(process.argv.slice(2));
}
