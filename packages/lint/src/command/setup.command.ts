import { Command, Action } from '@stbui/one-common';
import { existsSync, copyFileSync, chmodSync, unlinkSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

@Command({
  name: 'setup',
  description: '部署环境',
  example: {
    command: 'zalint setup',
    description: '部署环境',
  },
})
export class SetupCommand {
  constructor() {}

  @Action()
  run() {
    const APP_PATH = process.cwd();

    // 项目根路径
    let projectPath = '';
    // git hooks 路径
    let gitHooksPath = '';

    const dir = __dirname;
    // /User/test/project/node_modules/@magi/lint/node_modules/@magijs/zalint
    const positon = dir.indexOf('node_modules');

    if (positon > -1) {
      projectPath = dir.substring(0, positon);
      // git目录
      const gitDir = join(projectPath, '.git');
      if (existsSync(gitDir)) {
        gitHooksPath = resolve(projectPath, gitDir, 'hooks');
      }
    }

    // lint
    ['.eslintrc.js', '.stylelintrc.js', '.prettierrc.js'].map(file => {
      // 如果是老项目没有迁移
      try {
        const PKG_PATH = join(APP_PATH, 'package.json');
        const pkgString = readFileSync(PKG_PATH, { encoding: 'utf-8' });
        // 自建项目, 没有lint
        if (pkgString.indexOf('react-scripts') > -1) {
          return;
        }
      } catch (e) {}

      const TEMPLATE_PATH = join(__dirname, '../../template', file);
      copyFileSync(TEMPLATE_PATH, join(projectPath, file));
      console.log('[zalint]', '✅ 修复配置', file);
    });

    // process.env.GIT_DIR
    // git hooks
    ['pre-commit', 'commit-msg'].map(hookName => {
      if (gitHooksPath === '') {
        return;
      }

      const TEMPLATE_PATH = join(__dirname, '../../template', hookName);
      copyFileSync(TEMPLATE_PATH, join(gitHooksPath, hookName));
      chmodSync(join(gitHooksPath, hookName), 0o775);
      console.log('[zalint]', '✅ 安装钩子', hookName);
    });

    // 删除钩子是避免与husky冲突
    ['prepare-commit-msg', 'post-commit'].map(hookName => {
      if (gitHooksPath === '') {
        return;
      }

      try {
        unlinkSync(join(gitHooksPath, './.git/hooks', hookName));
        console.log('[zalint]', '✅ 删除钩子', hookName);
      } catch (e) {
        // 没有husky，没有git init
      }
    });
  }
}
