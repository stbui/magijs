import { fork } from 'child_process';
import DataCollect from '@magijs/data-collection';
import { Rewrite } from './rewrite';

const { version } = require('../package');
const umiVersion = require('umi/package').version;

export class Middleware {
  private _presets?: string;
  private dataCollect: DataCollect;

  constructor(options: { presets: string; platformHost?: any }) {
    this._presets = options.presets;

    new Rewrite();
    this.dataCollect = new DataCollect({
      HOST: options.platformHost,
      magiVersion: version,
      coreVersion: umiVersion,
      core: 'umi',
    });

    if (process.env.DEPLOY_ENV) {
      process.env.UMI_ENV = process.env.DEPLOY_ENV;
      process.env.MAGI_EN = process.env.DEPLOY_ENV;
    } else {
      if (!process.env.UMI_ENV && process.env.MAGI_ENV) {
        process.env.UMI_ENV = process.env.MAGI_ENV;
      } else {
        process.env.UMI_ENV = 'dev';
      }
    }

    // 插件集
    process.env.UMI_PRESETS = require.resolve(this._presets);
    process.env.ZAJS_VERSION = version;
    process.env.MAGI_VERSION = version;
  }

  setup() {
    console.log(`magi@${version} core@${umiVersion}...`);

    const commands = process.argv.slice(2);
    const child = fork(require.resolve('umi/bin/umi'), commands, {
      stdio: 'inherit',
    });

    // 数据统计
    this.dataCollect.commandStart({
      env: !process.env.DEPLOY_ENV ? 'local' : process.env.UMI_ENV,
      action: commands.length > 0 ? commands[0] : '',
    });

    //
    child.on('message', (args: any) => {
      if (process.send) {
        process.send(args);
      }
      if (args.type === 'DONE') {
        // 本地启动完成
        this.dataCollect.commandEnd();
      }
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        // umi进程退出
        !commands.includes('dev') && this.dataCollect.commandEnd();
      } else {
        if (signal === 'SIGABRT') {
          process.exit(1);
        }
        process.exit(code || 0);
      }
    });
    process.on('SIGINT', () => {
      child.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      child.kill('SIGTERM');
    });
  }
}
