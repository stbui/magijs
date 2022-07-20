const pkg = require('./package.json');
const ncc = require('@vercel/ncc');
const fs = require('fs');
const path = require('path');

Object.keys(pkg.devDependencies).map(dependencie => {
  const modulePath = require.resolve(dependencie);
  if (['@vercel/ncc', 'dts-packer'].includes(dependencie)) {
    return;
  }

  console.log(modulePath);

  ncc(modulePath, {
    minify: true,
  }).then(({ code, map, assets }) => {
    // console.log(dependencie);
    if (!fs.existsSync(dependencie)) {
      fs.mkdirSync(dependencie);
    }
    fs.writeFileSync(path.join(dependencie, 'index.js'), code, { encoding: 'utf8' });
  });
});
