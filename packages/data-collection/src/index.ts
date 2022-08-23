import path from 'path';
import request from 'request';
import getGitInfo from './git/get-git-info';
import { UserProject } from './UserProject';

// 注意：当前环境，发布时修改成生产环境
const CUR_ENV = 'prd';

interface Options {
  magiVersion: string; // magi版本
  core: 'umi' | 'vite'; // 内核
  coreVersion: string; // 内核版本
  packageJson?: string; // 应用package
  name?: string; // 应用名称
  version?: string; // 应用版本
  env?: string; // 环境
  action?: string; // 命令
  repository?: string; // git remote
  nodeEnv?: string;
  projectName?: string;
  timestamp?: number;
  path?: string;
  HOST?: any;
}

const userProject = new UserProject();

class DataCollect {
  private options: Options;
  private startTime: number = 0;
  private collectData: any;
  private host;

  constructor(options: Options) {
    this.options = options;
    this.host = options.HOST;

    const packageJson = require(path.resolve(process.cwd(), 'package.json'));
    if (packageJson) {
      this.options = {
        ...options,
        name: packageJson.name,
        version: packageJson.version,
        packageJson: JSON.stringify(packageJson),
        repository: userProject.repository,
        projectName: userProject.name,
        path: userProject.path,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().getTime(),
      };
    }

    const gitInfo = getGitInfo(process.cwd());
    if (gitInfo) {
      Object.assign(this.options, gitInfo);
    }

    // 是否存在package-lock.json
        const lock = require(path.resolve(process.cwd(), 'package-lock.json'));
        if (lock) {
          // @ts-ignore
          this.options.isPackageLock = true
    }
  }

  /**
   * 开始执行命令
   */
  commandStart(data: { env: any; action: string }) {
    // 执行 dev 和 build命令时统计
    if (!['deploy'].includes(data.action)) {
      this.startTime = Date.now();
    }
    this.options.env = data.env;
    this.options.action = data.action;
    this.send();
  }

  /**
   * 执行命令结束
   */
  commandEnd() {
    if (this.startTime) {
      const actionTime = Date.now() - this.startTime;
      this.send({ actionTime });
    }
  }

  send(data: any = {}) {
    if (!this.host) {
      return;
    }

    const sendBody = {
      ...this.options,
      ...data,
    };

    // 如果发送过，就在该条数据上做更新
    if (this.collectData) {
      sendBody.id = this.collectData._id;
    }

    let host = this.host[CUR_ENV];
    if (CUR_ENV === 'prd' && this.options.env === 'local') {
      host = this.host.prd_local;
    }

    const options = {
      method: 'POST',
      url: `${host}/api/magi/collect`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendBody),
    };
    request(options, (error, response) => {
      try {
        if (error) throw new Error(error);
        const res = JSON.parse(response.body);
        if (res.code === '0') {
          this.log('[magi]:', '统计发送成功');
          this.collectData = res.result;
        } else {
          this.log('[magi]:', '统计发送失败', res);
        }
      } catch (error) {
        this.log(error);
      }
    });
  }

  log(...args) {
    // 生产环境不打印请求日志
    if (['prd'].includes(CUR_ENV)) return;
    console.log(...args);
  }
}

export default DataCollect;
