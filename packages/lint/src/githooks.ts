import fs from 'fs';
import path from 'path';

export const findHooksDir = () => {
  const dir = __dirname;
  const positon = dir.indexOf('node_modules');
  const ROOT = dir.substring(0, positon);

  let gitDir = path.join(ROOT, '.git');
  if (!fs.existsSync(gitDir)) {
    return '';
  }

  return path.resolve(ROOT, gitDir, 'hooks');
};

export const getCodeFilePath = filename => {
  if (filename) {
    return path.join(__dirname, `../../githooks/${filename}`);
  }

  return '';
};

export const PreCommit = (dirHooks: string) => {
  const destPath = path.join(dirHooks, 'pre-commit');
  const srcPath = getCodeFilePath('pre-commit');
  fs.copyFileSync(srcPath, destPath);

  console.log('[zalint]', 'install pre-commit', srcPath, destPath);
};

export const CommitMsg = (dirHooks: string) => {
  const destPath = path.join(dirHooks, 'commit-msg');
  const srcPath = getCodeFilePath('commit-msg');
  fs.copyFileSync(srcPath, destPath);

  console.log('[zalint]', 'install commit-msg', srcPath, destPath);
};

const dirHooks = findHooksDir();
PreCommit(dirHooks);
CommitMsg(dirHooks);
