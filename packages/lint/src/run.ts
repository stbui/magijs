import { report } from './report';

export async function run(argv?) {
  if (argv.includes('--report')) {
    report();
    return;
  }

  console.log('[magi]:', '开始执行检查代码规范');
  require('./lintstaged');
}
