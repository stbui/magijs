/**
 * @license
 * Copyright Stbui All Rights Reserved.
 * https://github.com/stbui/one
 */

import { Command, Action } from '@stbui/one-common';

@Command({
  name: 'help',
  description: '帮助',
  example: {
    command: 'zalint help',
    description: '帮助',
  },
})
export class HelpCommand {
  constructor() {}

  @Action()
  run() {
    const commands = [
      {
        name: 'eslint',
        description: 'ts,tsx,js,jsx 静态扫描',
        options: [
          {
            propertyName: 'dir',
            alias: 'd',
            description: '指定目录，默认src目录',
          },
          {
            propertyName: 'fix',
            alias: 'fix',
            description: '按照配置规则修复代码',
          },
        ],
      },
      {
        name: 'stylelint',
        description: 'scss,css 静态扫描',
        options: [
          {
            propertyName: 'dir',
            alias: 'd',
            description: '指定目录，默认src目录',
          },
          {
            propertyName: 'fix',
            alias: 'fix',
            description: '按照配置规则修复代码',
          },
        ],
      },
      {
        name: 'staged',
        description: '待提交代码扫描',
        options: [
          {
            propertyName: 'dir',
            alias: 'd',
            description: '指定目录，默认src目录',
          },
          {
            propertyName: 'fix',
            alias: 'fix',
            description: '按照配置规则修复代码',
          },
        ],
      },
      {
        name: 'prettier',
        description: '代码格式化',
        options: [
          {
            propertyName: 'dir',
            alias: 'd',
            description: '指定目录，默认src目录',
          },
        ],
      },
      {
        name: 'report',
        description: '生成报告文件',
        options: [],
      },
      {
        name: 'doctor',
        description: '修复环境配置',
        options: [],
      },
    ];

    const pkg = require('../../package.json');
    console.log('');

    commands.forEach(command => {
      console.log('zalint', `${command.name}  --   ${command.description}`);
      command.options.forEach(option => {
        console.log(` -${option.propertyName} -${option.alias}   -  ${option.description}`);
      });

      console.log('');
    });
  }
}
