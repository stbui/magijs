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
