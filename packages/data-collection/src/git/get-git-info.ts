import fs from 'fs';
import path from 'path';

// 获取git分支信息
function getGitInfo(dir) {
  try {
    const gitPath = path.join(dir, './.git');
    const head: any = fs.readFileSync(gitPath + '/HEAD', 'utf-8');
    const heads = head.match(/[\S]+/g)[1];
    const hash = fs.readFileSync(gitPath + '/' + heads, 'utf-8');
    return {
      branch: heads.replace('refs/heads/', ''),
      branchHash: hash,
    };
  } catch (e) {
    return;
  }
}

export default getGitInfo;
