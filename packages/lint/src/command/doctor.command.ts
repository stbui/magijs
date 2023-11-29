/**
 * @license
 * Copyright Stbui All Rights Reserved.
 * https://github.com/stbui/one
 */

import { Command, Action } from '@stbui/one-common';
import { copyFileSync, writeFileSync, chmodSync, unlinkSync } from 'fs';
import { join } from 'path';

@Command({
  name: 'doctor',
  description: '修复配项目配置',
  example: {
    command: 'zalint doctor',
    description: '修复配项目配置',
  },
})
export class DoctorCommand {
  constructor() {}

  @Action()
  run() {
    const APP_PATH = process.cwd();

    // 修复 配置文件
    ['.eslintrc.js', '.stylelintrc.js', '.prettierrc.js'].map(file => {
      const TEMPLATE_PATH = join(__dirname, '../../template', file);
      copyFileSync(TEMPLATE_PATH, join(APP_PATH, file));
      console.log('[zalint]', '✅ 修复配置', file);
    });

    // 修复 git hooks
    ['pre-commit', 'commit-msg'].map(hookName => {
      const TEMPLATE_PATH = join(__dirname, '../../template', hookName);
      copyFileSync(TEMPLATE_PATH, join(APP_PATH, './.git/hooks', hookName));
      chmodSync(join(APP_PATH, './.git/hooks', hookName), 0o775);
      console.log('[zalint]', '✅ 安装钩子', hookName);
    });

    // 删除钩子
    ['prepare-commit-msg', 'post-commit'].map(hookName => {
      unlinkSync(join(APP_PATH, './.git/hooks', hookName));
      console.log('[zalint]', '✅ 删除钩子', hookName);
    });

    // -------------------

    // 删除冗余的包
    const deps = [
      'lint-staged',
      'husky',
      'prettier',

      // eslint
      'eslint',
      'eslint-config-za',
      'eslint-plugin-babel',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-vue',

      // stylelint
      'stylelint',
      'stylelint-checkstyle-formatter',
      'stylelint-config-recommended-scss',
      // babel
      '@babel/plugin-proposal-decorators',
      '@babel/eslint-parser',
      '@babel/eslint-plugin',
      '@babel/preset-react',
    ];

    const PKG_PATH = join(APP_PATH, 'package.json');
    const packageModule = require(PKG_PATH);

    deps.forEach(dep => {
      delete packageModule.dependencies[dep];
      delete packageModule.devDependencies[dep];
    });

    console.log('[zalint]', '✅ 修复依赖', 'package.json');
    writeFileSync(PKG_PATH, JSON.stringify(packageModule, null, 2));
  }

  // 校验script配置
}
