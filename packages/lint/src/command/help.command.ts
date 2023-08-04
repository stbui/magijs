/**
 * @license
 * Copyright Stbui All Rights Reserved.
 * https://github.com/stbui/one
 */

import { Command, Action } from '@stbui/one-common';

@Command({
  name: 'help',
  description: '初始化',
  example: {
    command: 'cli help',
    description: '初始化',
  },
})
export class HelpCommand {
  constructor(private readonly service) {}

  @Action()
  run() {
    const commands = this.service.getCommands();

    const pkg = require('../../package.json');
    console.log(pkg.name);
    console.log('');

    commands.forEach(command => {
      console.log(`  ${command.name}  \<command\> -- ${command.description}`);
      console.log('');

      command.options.forEach(option => {
        console.log(`    -${option.propertyName}  -${option.alias}    \<option\>  - ${option.description}`);
      });

      console.log('');
    });
  }
}
