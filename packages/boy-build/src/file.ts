import fs from 'fs';
import path from 'path';
import resolve from 'resolve';
import { replaceImports } from './utils';
import { Packer } from './dts';

export class File {
  pkg;
  filePath;
  absFilePath;
  absFileDir;

  constructor(opts: { pkg: any; filePath: string }) {
    this.pkg = opts.pkg;
    this.filePath = opts.filePath;
    this.absFilePath = path.join(this.pkg.pkgRoot, this.filePath);
    this.absFileDir = path.dirname(this.absFilePath);
    this.parse();
  }

  writeContent(content: string) {
    const filePath = path.join(this.pkg.typesRoot, this.filePath);
    fs.mkdirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  getPrefix({ isExternal, key }: any) {
    let filePath = this.filePath;
    // 删除前置的 ./
    filePath = filePath.replace(/^\.\//, '');
    // 计算路径长度，非 root +1
    let len = filePath.split('/').length;
    const isRoot = this.pkg === this.pkg.rootPackage;
    if (!isRoot) {
      len += 1;
    }
    // external 时要往上再找一级
    if (isExternal && key) {
      len += key.charAt(0) === '@' ? 2 : 1;
    }
    // 返回 ./ 或多个 ../
    if (len === 1) {
      return './';
    } else {
      return new Array(len).join('../');
    }
  }
  getExternals() {
    const externals = this.pkg.opts.externals || [];
    return externals.reduce((memo, key) => {
      memo[key] = `${this.getPrefix({ isExternal: true, key })}${key}`;
      return memo;
    }, {});
  }
  parse() {
    console.log('> ', this.filePath, this.absFilePath);
    const { content, localImports, depImports } = replaceImports({
      content: fs.readFileSync(this.absFilePath, 'utf-8'),
      prefix: this.getPrefix({}),
      externals: this.getExternals(),
    });

    this.writeContent(content);
    localImports.forEach(localImport => {
      console.log('>> local import', localImport);
      const filePath = path.relative(
        this.pkg.pkgRoot,
        resolve.sync(localImport, {
          basedir: path.dirname(this.absFilePath),
          extensions: ['.d.ts'],
        })
      );

      if (!this.pkg.files[filePath]) {
        this.pkg.addFile(filePath);
        new File({
          pkg: this.pkg,
          filePath,
        });
      }
    });

    depImports.forEach(depImport => {
      console.log('>> dep import', depImport);
      const len = depImport.split('/').length;
      const scoped = depImport.charAt(0) === '@';
      if (scoped) {
        if (len !== 2) {
          console.warn(`暂不支持 deepImport, ${depImport}`);
          depImport = depImport.split('/').slice(0, 2).join('/');
        }
      } else {
        if (len !== 1) {
          console.warn(`暂不支持 deepImport, ${depImport}`);
          depImport = depImport.split('/').slice(0, 1).join('/');
        }
      }
      if (!this.pkg.rootPackage.packages[depImport]) {
        this.pkg.rootPackage.packages[depImport] = true;
        new Packer({
          cwd: this.absFileDir,
          name: depImport,
          typesRoot: path.join(this.pkg.rootPackage.typesRoot, depImport),
          rootPackage: this.pkg.rootPackage,
        });
      }
    });
  }
}
