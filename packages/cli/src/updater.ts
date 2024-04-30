import chalk from '@magijs/compiled/chalk';
import { join } from 'path';

export function Updater() {
  const tag = 'latest';

  let appPackage: any = {};
  try {
    appPackage = require(join(process.cwd(), 'package.json'));
  } catch (e) {
    console.log(chalk.yellow(`[magi] read ${join(process.cwd(), 'package.json')} failed.`));
  }

  let locked = false;
  let versionInApp;

  if (appPackage.dependencies?.['@magi/magi']) {
    versionInApp = appPackage.dependencies['@magi/magi'];
  } else if (appPackage.devDependencies?.['@magi/magi']) {
    versionInApp = appPackage.devDependencies['@magi/magi'];
  }

  if (versionInApp && versionInApp.indexOf('^') === -1) {
    locked = true;
  }

  const str = chalk.red(`${locked ? 'npm install --save @magi/cli@latest && ' : ''}npm upgrade`);

  const pkg = {
    ...require('../package.json'),
  };
  pkg.name = '@magi/magi';

  return new Promise((resolve, reject) => {
    try {
      const version = '0.0.1-alpha.49';

      console.log(
        chalk.yellow(
          `检测到 magi 新版本: ${chalk.magenta(pkg.version)}(本地版本) → ${chalk.magenta(version)}(最新版本)`
        )
      );
      console.log(chalk.red(`当前版本(${pkg.version})，存在安全漏洞，请尽快升级${version}版本`));
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}
