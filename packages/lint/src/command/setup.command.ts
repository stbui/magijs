import { Command, Action } from '@stbui/one-common';
import { existsSync, copyFileSync, chmodSync } from 'fs';
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
    const lint_templates = ['.eslintrc.js', '.stylelintrc.js', '.prettierrc.js'];
    lint_templates.map((template) => {
      const TEMPLATE_PATH = join(__dirname, '../../template', template);
      copyFileSync(TEMPLATE_PATH, join(projectPath, template));
      console.log('[zalint]', '✅ install', template);
    });

    // git hooks
    // 删除其他hooks
    
    const hooks_templates = ['pre-commit', 'commit-msg'];
    hooks_templates.map((template) => {
      const TEMPLATE_PATH = join(__dirname, '../../template', template);
      copyFileSync(TEMPLATE_PATH, join(gitHooksPath, template));
      chmodSync(join(gitHooksPath, template), 0o775);
      console.log('[zalint]', '✅ install', template);
    });
  }
}
