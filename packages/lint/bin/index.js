#!/usr/bin/env node

const pkg = require('../package.json');
console.log('[zalint]', 'version:', pkg.version);

require('../lib/cli');
