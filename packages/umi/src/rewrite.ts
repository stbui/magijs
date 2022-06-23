import { readFileSync, writeFileSync, existsSync } from 'fs';
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
      const file = require.resolve('@umijs/core/lib/Service/getPaths');
      this.replace(/\.umi/g, `.${this._alias}`, file);

      // 83行
      const file2 = require.resolve('@umijs/core/lib/Config/Config');
      this.replace(/\.umirc/g, `.${this._alias}rc`, file2);

      // getBabelOpts
      const file3 = require.resolve('@umijs/bundler-utils/lib/getBabelOpts');
      this.replace(/\.umi/g, `.${this._alias}rc`, file3);

      // const file4 = require.resolve('@umijs/preset-built-in/lib/plugins/features/umiInfo');
      // const info = readFileSync(path.join(__dirname, './umiInfo.js'));
      // writeFileSync(file4, info, 'utf-8');
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
