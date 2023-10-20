import { Factory } from '@stbui/one-cli';
import {
  EslintCommand,
  StylelintCommand,
  ReportCommand,
  PrettierCommand,
  StagedCommand,
  SetupCommand,
  DoctorCommand,
  HelpCommand,
} from './command';

const pkg = require('../package.json');
console.log('[zalint]', 'version:', pkg.version);

function bootstrap() {
  Factory.create([
    EslintCommand,
    StylelintCommand,
    ReportCommand,
    PrettierCommand,
    StagedCommand,
    SetupCommand,
    DoctorCommand,
    HelpCommand,
  ]);
}

bootstrap();
