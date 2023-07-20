import { fork } from 'child_process';
import { writeFileSync } from 'fs';
import { join, resolve } from 'path';

export function cli(command: string[]) {
  const eslint = resolve(require.resolve('eslint'), '../../bin/eslint.js');

  fork(eslint, command, {
    stdio: 'inherit',
  });

  console.log('[magi][zalint]', command);
}

function readAppConfig() {
  const APP = process.cwd();
  const config_path = join(APP, 'zalint.json');

  return JSON.parse(config_path);
}

function readDefaultConfig() {
  const config = require('./config/eslint');

  return config;
}

/**
 * 合并配置文件
 * @param source
 * @param target
 */
function mergeConfig(source, target) {
  const rules = Object.assign({}, target.rules, source.rules);

  target.rules = rules;
  return target;
}

/**
 * 生成配置文件
 */
function generateConfig(config) {
  writeFileSync('lib/config/eslint.js', `module.exports = ${JSON.stringify(config)}`, 'utf-8');
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

  // 1. 读取zalint.json 配置, 取出规则eslintrc.rules
  // 2. 与默认配置config/eslint规则合并
  // 3. 生成新的配置文件
  // 4. 执行cli
  // 5. 上传 zalint.json 配置, 后续分析之用

  try {
    const rc = readAppConfig().eslintrc;
    generateConfig(mergeConfig(rc, readDefaultConfig()));
    save(rc);
  } catch (e) {
    // console.log('[magi][zalint]', 'zalint.json配置文件不存在');
  }

  const defaultCommand = ['--fix', '--config', require.resolve('./config/eslint'), '--ext', 'ts,tsx,js,jsx'].concat(
    _argv
  );

  cli(defaultCommand);
}
