/**
 * @license
 * Copyright Stbui All Rights Reserved.
 * https://github.com/stbui/one
 */

import { Command, Option, Action } from '@stbui/one-common';
import { copyFileSync, writeFileSync, chmodSync } from 'fs';
import { join } from 'path';

@Command({
  name: 'doctor',
  description: '检查配项目配置',
  example: {
    command: 'zalint doctor --fix',
    description: '检查配项目配置',
  },
})
export class DoctorCommand {
  constructor() {}

  @Option({
    description: '修复配置',
  })
  fix: boolean = false;

  @Action()
  run() {
    const APP_PATH = process.cwd();

    const lint_templates = ['.eslintrc.js', '.stylelintrc.js', '.prettierrc.js'];

    lint_templates.map(template => {
      const TEMPLATE_PATH = join(__dirname, '../../template', template);
      copyFileSync(TEMPLATE_PATH, join(APP_PATH, template));
      console.log('[zalint]', '✅ 修复', template);
    });

    const hooks_templates = ['pre-commit', 'commit-msg'];
    hooks_templates.map(template => {
      const TEMPLATE_PATH = join(__dirname, '../../template', template);
      copyFileSync(TEMPLATE_PATH, join(APP_PATH, './.git/hooks', template));
      chmodSync(join(APP_PATH, './.git/hooks', template), 0o775);
      console.log('[zalint]', '✅ 修复', template);
    });

    // -------------------

    const deps = [
      'lint-staged',
      'husky',
      'prettier',
      'eslint',
      'eslint-config-za',
      'stylelint',
      'stylelint-checkstyle-formatter',
      'stylelint-config-recommended-scss',
    ];

    const PKG_PATH = join(APP_PATH, 'package.json');
    const packageModule = require(PKG_PATH);

    deps.forEach(dep => {
      delete packageModule.dependencies[dep];
      delete packageModule.devDependencies[dep];
    });

    console.log('zalint', '✅ 修复依赖包');
    writeFileSync(PKG_PATH, JSON.stringify(packageModule, null, 2));
  }
}
