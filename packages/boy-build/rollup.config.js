import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const config = Object.keys(pkg.dependencies).map(dependencie => {
  const modulePath = require.resolve(dependencie);
  console.log(modulePath);

  return {
    input: modulePath,
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: dependencie + '.js',
      exports: 'auto',
    },
    plugins: [resolve(), commonjs(), json(), typescript({ tsconfig: 'tsconfig.json' })],
  };
});

console.log(config);

export default config;
