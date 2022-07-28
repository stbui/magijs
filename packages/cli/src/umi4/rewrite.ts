import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export class Rewrite {
  private _alias = 'magi';

  constructor() {
    this.modify();
  }

  set alias(val) {
    this._alias = val;
  }

  /**
   *
   * @param regex
   * @param replacement
   * @param paths
   */
  replace(regex: any, replacement: string, paths: string) {
    const content = readFileSync(paths, 'utf-8');
    const newContent = content.replace(regex, replacement);
    writeFileSync(paths, newContent, 'utf-8');
  }

  modify() {
    // 已经修改源文件
    if (this.hasLockFile()) {
      return;
    }

    try {
      // 70行
      const file = require.resolve('umi/dist/constants');
      this.replace(/\umi/g, `.${this._alias}`, file);

      const dev = require.resolve('@umijs/preset-umi/dist/commands/dev/dev');
      this.replace('import_utils.logger.info', '//', dev);

      const build = require.resolve('@umijs/preset-umi/dist/commands/build');
      this.replace('import_utils.logger.info', '//', build);
    } catch (e) {
      console.error(`[${this._alias}] 内核文件风险提示`);
    }

    // 文件的标志性lock
    this.writeLockFile();
  }

  hasLockFile() {
    const filePath = path.resolve(require.resolve('@umijs/core/package.json'), `../${this._alias}.lock`);

    return existsSync(filePath);
  }

  writeLockFile() {
    const filePath = path.resolve(require.resolve('@umijs/core/package.json'), `../${this._alias}.lock`);

    return writeFileSync(filePath, 'ok');
  }
}
