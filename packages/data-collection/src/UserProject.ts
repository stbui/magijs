import gitRemoteOriginUrl from './git/git-remote-origin-url';

export class UserProject {
  constructor() {}

  get path() {
    return process.cwd();
  }

  get name() {
    try {
      const paths = this.path.split('/');
      const name = paths[paths.length - 1];

      return name;
    } catch (e) {
      return '未知';
    }
  }

  get repository() {
    try {
      return gitRemoteOriginUrl();
    } catch (e) {
      return '';
    }
  }
}
