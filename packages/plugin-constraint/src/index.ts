import { existsSync, readdirSync, statSync } from 'fs';
import { join, basename, extname } from 'path';
import { IApi } from 'umi';
import GitInfo from '@magijs/compiled/git-local-info';
import chalk from '@magijs/compiled/chalk';

import { printError } from './printError';
import { getErrorMsg } from './getErrorMsg';
import rules from './rules.json';

const { green, red } = chalk;

function highlight(args: string) {
  return chalk.white.bold(args);
}

function getRules() {
  const root = join(__dirname, 'rules');
  return readdirSync(root)
    .filter(file => file.charAt(0) !== '.')
    .filter(file => statSync(join(root, file)).isFile())
    .filter(file => !file.endsWith('.d.ts') && !file.endsWith('.js.map'))
    .map(file => {
      return basename(file, extname(file));
    });
}

export default (api: IApi) => {
  api.describe({
    key: 'strict',
    config: {
      schema(joi) {
        return joi.object({
          rules: joi.object(),
        });
      },
    },
  });

  const { cwd } = api;

  function isRuleEnable(opts: { ruleId: string; rule }) {
    if (!opts.rule) return false;

    if (opts.rule.alwaysEnable) return true;

    if (opts.rule.enableByConfig && api.userConfig.strict?.rules?.[opts.ruleId]) {
      return true;
    }

    if (!opts.rule.enableByConfig && api.userConfig.strict && api.userConfig.strict?.rules?.[opts.ruleId] !== false) {
      return true;
    }

    return false;
  }

  let repository;
  if (existsSync(join(cwd, '.git'))) {
    const gitInfo = new GitInfo({ gitPath: cwd });
    const gitInfoRet = gitInfo.getGitInfo || {};
    repository = gitInfoRet.repository;
  }

  // 取不到 repository 时忽略
  if (!repository) return;

  const ruleIds = getRules();
  ruleIds.map(ruleId => {
    const rule = rules[ruleId];
    const isEnable = isRuleEnable({ ruleId, rule });
    if (isEnable) {
      require(`./rules/${ruleId}`).default(api, {
        printError: printError.bind(null, { ruleId, rule }),
        getErrorMsg: getErrorMsg.bind(null, { ruleId, rule }),
        highlight,
      });
    }
  });

  api.onPluginReady(() => {
    console.log(green(`🎉🎉🎉 默认开启强约束规则.`));
  });

  api.registerCommand({
    name: 'constraint',
    description: '约束规则',
    fn: ({ args }) => {
      console.log();

      if (api.userConfig.strict) {
        console.log(green('强约束已开启，因为配置里包含 strict 。'));
      } else {
        console.log(red('强约束未开启。'));
      }

      console.log();
      console.log('规则列表：');
      ruleIds.forEach(ruleId => {
        const rule = rules[ruleId];
        const isEnable = isRuleEnable({ ruleId, rule });
        console.log(`  - ${ruleId} [${isEnable ? green('开启') : red('关闭')}]`);
      });
      console.log();
    },
  });
};
