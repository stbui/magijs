const pkg = require('./package.json');
const ncc = require('@vercel/ncc');
const fs = require('fs');
const path = require('path');

function bundle() {
  Object.keys(pkg.devDependencies).map(dependencie => {
    const modulePath = require.resolve(dependencie);
    if (['@vercel/ncc', 'dts-packer'].includes(dependencie)) {
      return;
    }

    build(modulePath, dependencie);
  });
}

function build(input, output) {
  ncc(input, {
    minify: true,
  }).then(({ code, map, assets }) => {
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output);
    }
    fs.writeFileSync(path.join(output, 'index.js'), code, { encoding: 'utf8' });
  });
}

// bundle();

// const modulePath = require.resolve('prettier/cli');
// build(modulePath, 'prettier');

// const modulePath = require.resolve('stylelint/lib/cli');
// build(modulePath, 'stylelint');