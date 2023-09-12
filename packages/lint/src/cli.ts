import { Factory } from '@stbui/one-cli';
import { EslintCommand } from './command/eslint.command';
import { StylelintCommand } from './command/stylelint.command';
import { ReportCommand } from './command/report.command';
import { PrettierCommand } from './command/prettier.command';
import { StagedCommand } from './command/staged.command';

const pkg = require('../package.json');
console.log('[magi][zalint]', 'version:', pkg.version);

function bootstrap() {
  Factory.create([EslintCommand, StylelintCommand, ReportCommand, PrettierCommand, StagedCommand]);
}

bootstrap();
