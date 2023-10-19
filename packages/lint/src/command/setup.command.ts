import { Command, Action } from '@stbui/one-common';
import { writeFileSync, existsSync, copyFileSync } from 'fs';
import path from 'path';

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
      const gitDir = path.join(projectPath, '.git');
      if (existsSync(gitDir)) {
        gitHooksPath = path.resolve(projectPath, gitDir, 'hooks');
      }
    }

    // .eslintrc.js
    const eslintrc = `module.exports = {
  extends: require.resolve('@magi/lint/eslint'),
};
`;

    // .stylelintrc.js
    const stylelintrc = `module.exports = {
  extends: require.resolve('@magi/lint/stylelint'),
};
`;

    console.log('[zalint]', 'install .eslintrc.js');
    writeFileSync(path.join(projectPath, '.eslintrc.js'), eslintrc);
    console.log('[zalint]', 'install .stylelintrc.js');
    writeFileSync(path.join(projectPath, '.stylelintrc.js'), stylelintrc);

    // prettier
    console.log('[zalint]', 'install .prettierrc.js');
    copyFileSync(require.resolve('../config/prettier'), path.join(projectPath, '.prettierrc.js'));

    // git hooks
    const precommit = `#!/usr/bin/env node
const childProcess = require('child_process');

try {
  console.log('[zalint]', '执行 npm run precommit');
  childProcess.exec('npm run precommit', {
    stdio: 'inherit',
  });
} catch (error) {
  console.log(error.stdout.toString());
  process.exit(1);
}
`;

    console.log('[zalint]', 'install', 'pre-commit');
    writeFileSync(path.join(gitHooksPath, 'pre-commit'), precommit, { mode: '755' });

    const commitMSG = `#!/usr/bin/env node
const childProcess = require('child_process');
const fs = require('fs');

console.log('[zalint]', '检查 commit 消息格式');
const email = childProcess.execSync('git config user.email').toString().trim();
const msg = fs.readFileSync(process.argv[2], 'utf-8').trim();
const commitRE =
  /^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?: .{1,100}/;

if (!commitRE.test(msg)) {
  console.log();
  console.error('不合法的 commit 消息格式，请使用正确的提交格式：');
  console.error("feat: add 'comments' option");
  console.error('fix: handle events on blur (close #28)');
  console.error('详情请查看 git commit 提交规范');
  process.exit(1);
}

if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email))) {
  console.error('[zalint]', '此用户没有权限提交，具有权限的用户为： xxx@zhongan.com');
  process.exit(1);
}
`;

    console.log('[zalint]', 'install', 'commit-msg');
    writeFileSync(path.join(gitHooksPath, 'commit-msg'), commitMSG, { mode: '755' });
  }
}
