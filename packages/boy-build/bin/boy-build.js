#!/usr/bin/env node

// const { join } = require('path');
// const { rollup } = require('rollup');
// const resolve = require('@rollup/plugin-node-resolve');
// const commonjs = require('@rollup/plugin-commonjs');
// const json = require('@rollup/plugin-json');
// // import { uglify } from 'rollup-plugin-uglify'
// const { Package } = require('dts-packer');

// run();
// function run() {
//   const cwd = process.cwd();
//   const pkgPath = join(cwd, 'package.json');
//   const pkg = require(pkgPath);

//   pkg.pack.map(dependencie => {
//     const modulePath = require.resolve(dependencie);

//     const input = {
//       input: modulePath,
//       plugins: [resolve.nodeResolve(), commonjs(), json()],
//     };

//     build(input, dependencie);

//     new Package({
//       cwd: process.cwd(),
//       name: dependencie,
//       typesRoot: dependencie,
//     });
//   });
// }

// async function build(input, moduleName) {
//   const bundle = await rollup(input);

//   const { output } = bundle.write({
//     entryFileNames: '[name].js',
//     dir: moduleName,
//     format: 'esm',
//   });

//   console.log(output);
// }

const cli = require('../lib/cli');

cli.run(process.argv.slice(2));
