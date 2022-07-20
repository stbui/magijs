const { join } = require('path');
const { rollup } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
import typescript from '@rollup/plugin-typescript';

// import { uglify } from 'rollup-plugin-uglify'

const { Package } = require('dts-packer');

export function buildDeps() {
  const cwd = process.cwd();
  const pkgPath = join(cwd, 'package.json');
  const pkg = require(pkgPath);

  pkg.pack.map(dependencie => {
    const modulePath = require.resolve(dependencie);

    build(modulePath, dependencie);

    try {
      new Package({
        cwd: process.cwd(),
        name: dependencie,
        typesRoot: dependencie,
      });
    } catch (e) {
      console.log(e);
    }
  });
}

export async function build(input, moduleName) {
  const bundle = await rollup({
    input,
    plugins: [resolve.nodeResolve(), commonjs(), json(),typescript()],
  });

  const { output } = bundle.write({
    entryFileNames: 'index.js',
    dir: moduleName,
    format: 'cjs',
  });

  console.log(output);
}

export function run(argv) {
  if (argv.includes('buildDeps')) {
    return buildDeps();
  }

  return build('src/index.ts', 'dist');
}
