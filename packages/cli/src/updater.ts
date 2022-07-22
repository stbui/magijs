import chalk from '@magijs/compiled/chalk';
import { join } from 'path';
import updater from 'npm-updater';

export class Updater {
  constructor() {
    const tag = 'latest';

    let appPackage: any = {};
    try {
      appPackage = require(join(process.cwd(), 'package.json'));
    } catch (e) {
      console.log(chalk.yellow(`[magi] read ${join(process.cwd(), 'package.json')} failed.`));
    }

    let locked = false;
    let versionInApp;

    if (appPackage.dependencies?.['@magijs/magi']) {
      versionInApp = appPackage.dependencies['@magijs/magi'];
    } else if (appPackage.devDependencies?.['@magijs/magi']) {
      versionInApp = appPackage.devDependencies['@magijs/magi'];
    }

    if (versionInApp && versionInApp.indexOf('^') === -1) {
      locked = true;
    }

    const str = chalk.red(`${locked ? 'npm install --save @magijs/magi@latest && ' : ''}npm upgrade`);

    const formatter = ({ version, current }: { version: string; current: string }) => {
      const isGlobal = __dirname.indexOf(process.cwd()) !== 0;
      return chalk.yellow(
        ` 检测到 magi 新版本: ${chalk.magenta(current)}(${isGlobal ? '全局' : '本地'}版本) → ${chalk.magenta(
          version
        )}(最新版本)\n   你可以执行 ${str}${isGlobal ? chalk.red(' @magijs/magi -g') : ''} 来更新版本。`
      );
    };

    const pkg = {
      ...require('../package.json'),
    };
    pkg.name = '@magijs/magi';

    return updater({
      package: pkg, // 从本地 package.json 里面读数据
      abort: false, // 当 repository 里面的版本和本地版本不一样时，不会终止
      interval: '1m', // 提示的间隔
      tag, // 和 repository 的哪个 tag 版本做比较
      registry: 'https://registry.npm.taobao.org',
      formatter, // 提示信息
    });
  }
}
