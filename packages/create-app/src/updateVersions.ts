import fs from 'fs';
import path from 'path';

const templatePath = path.join(__dirname, '..');
const templates = fs.readdirSync(templatePath).filter(d => d.startsWith('template-'));

for (const t of templates) {
  const pkgPath = path.join(templatePath, t, `package.json`);
  const pkg = require(pkgPath);

  // const lernaPath = path.join(__dirname, '../../../lerna.json');
  // let version = require(lernaPath).version;
  let version = require('../package.json').version;
  // const version = '0.0.17';

  pkg.devDependencies['@magi/cli'] = `^` + version;
  pkg.dependencies['@magi/magi'] = `^` + version;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}
