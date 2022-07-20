import path from 'path';
import fs from 'fs';
import { File } from './file';
import resolve from 'resolve';
import { getTypedName } from './utils';

export class Packer {
  cwd;
  opts;
  typesRoot;
  pkgRoot;
  importPrefix;
  rootPackage;
  packages;
  files;
  entryFile;

  constructor(opts) {
    this.opts = opts;
    this.cwd = fs.realpathSync(opts.cwd);
    this.rootPackage = opts.rootPackage || this;
    this.typesRoot = opts.typesRoot || path.join(this.cwd, 'types', opts.name);
    this.packages = {
      [this.opts.name]: true,
    };
    this.files = {};
    this.init();
  }

  addFile(file) {
    this.files[file] = true;
  }

  init() {
    const entryFile = this.getEntryFile();
    this.entryFile = entryFile;
    this.addFile(entryFile);
    new File({
      pkg: this,
      filePath: entryFile,
    });
  }

  getPkg(): { pkg: any; pkgRoot: any } {
    let pkg = {};
    let pkgRoot = '';
    try {
      const pkgJSONPath = resolve.sync(`${this.opts.name}/package.json`, {
        basedir: this.cwd,
      });
      pkgRoot = path.dirname(pkgJSONPath);
      pkg = JSON.parse(fs.readFileSync(pkgJSONPath, 'utf-8'));
    } catch (_e) {}
    return {
      pkg,
      pkgRoot,
    };
  }
  getEntryFile() {
    const { pkg, pkgRoot } = this.getPkg();
    const types = pkg.types || pkg.typings;
    if (types) {
      this.pkgRoot = pkgRoot;
      if (
        types.endsWith('.d.ts') &&
        fs.statSync(path.join(pkgRoot, types)).isFile() &&
        fs.existsSync(path.join(pkgRoot, types))
      ) {
        return types;
      } else if (fs.existsSync(path.join(pkgRoot, `${types}.d.ts`))) {
        return `${types}.d.ts`;
      } else if (fs.existsSync(path.join(pkgRoot, types, 'index.d.ts'))) {
        return path.join(types, 'index.d.ts');
      } else {
        throw new Error(`Package ${this.opts.name} 里声明了 types 为 ${pkg.types}，但实际不存在。`);
      }
    } else if (fs.existsSync(path.join(pkgRoot, 'index.d.ts'))) {
      this.pkgRoot = pkgRoot;
      return 'index.d.ts';
      // } else if (
      //   pkg.main &&
      //   existsSync(join(pkgRoot, getTypesFormMain({ main: pkg.main })))
      // ) {
      //   this.pkgRoot = pkgRoot;
      //   return getTypesFormMain({ main: pkg.main });
    } else {
      const typedName = getTypedName(this.opts.name);
      const typedPkgJSONPath = resolve.sync(`${typedName}/package.json`, {
        basedir: this.cwd,
      });
      const typedPkgRoot = path.dirname(typedPkgJSONPath);
      const typedPkg = JSON.parse(fs.readFileSync(typedPkgJSONPath, 'utf-8'));
      this.pkgRoot = typedPkgRoot;
      const types = typedPkg.types || typedPkg.typings;
      if (types && fs.existsSync(path.join(typedPkgRoot, types))) {
        return types;
      } else if (fs.existsSync(path.join(typedPkgRoot, 'index.d.ts'))) {
        return 'index.d.ts';
      } else {
        throw new Error(`找不到 ${typedName} 的入口文件。`);
      }
    }
  }
}
