import fs from 'fs';
import path from 'path';

export const getGithooksPath = () => {
  const ROOT = process.cwd();

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

export const PreCommit = () => {
  const hooks = getGithooksPath();
  const destCommitPath = path.join(hooks, 'pre-commit');
  const srcCommitPath = getCodeFilePath('pre-commit');
  fs.copyFileSync(srcCommitPath, destCommitPath);
  console.log('pre-commit ok');
};

export const CommitMsg = () => {
  const hooks = getGithooksPath();
  const destCommitMSGFile = path.join(hooks, 'commit-msg');
  const srcCommitMSGPath = getCodeFilePath('commit-msg');
  fs.copyFileSync(srcCommitMSGPath, destCommitMSGFile);
  console.log('commit-msg ok');
};

PreCommit();
CommitMsg();
