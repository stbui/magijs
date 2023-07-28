import { fork } from 'child_process';
import { join, resolve } from 'path';
import fs from 'fs';

export function cli(command: string[]) {
  const eslint = resolve(require.resolve('eslint'), '../../bin/eslint.js');

  fork(eslint, command, {
    stdio: 'inherit',
  });

  console.log('[magi][zalint]', command);
}

function readAppConfig() {
  const APP = process.cwd();
  const config_path = join(APP, './.eslintrc');
  const content = fs.readFileSync(config_path, 'utf-8');

  // 删除
  fs.rmSync(config_path);

  return JSON.parse(content);
}

// 保存配置文件到magi
function save(body) {
  console.log('.');
}

/**
 * []
 * ['src']
 * ['src','--fix']
 * ['--fix']
 * ['dir','--fix']
 * @param argv
 */
export function exec(argv: string[] = []) {
  let _argv = argv;

  if (argv.length === 0) {
    _argv = ['src'];
  } else if (argv[0] === '--fix') {
    _argv = ['src'].concat(argv);
  }

  // const _argv = argv.includes('src') ? argv : ['src'].concat(argv);

  try {
    //

    const rc = readAppConfig();
    save(rc);
  } catch (e) {
    // console.log('[magi][zalint]', 'zalint.json配置文件不存在');
  }

  const defaultCommand = ['--fix', '--config', require.resolve('./config/eslint'), '--ext', 'ts,tsx,js,jsx'].concat(
    _argv
  );

  cli(defaultCommand);
}
