import { codeFrameColumns } from '@babel/code-frame';
import link from '@magijs/compiled/terminal-link';
import chalk from '@magijs/compiled/chalk';

const { red, green, white, bold } = chalk;

export function getErrorMsg(opts: { ruleId: string; rule }, args: { why?: string; path?: any; node?: any } = {}) {
    const ruleLink = `http://docs.test.za.biz/advanced/constraint#${opts.ruleId}`;

    const msg: any = [];
    if (args.path && !args.node) {
        msg.push(args.path.buildCodeFrameError(''));
    }
    if (args.node && args.path) {
        msg.push(
            codeFrameColumns(args.path.hub.file.code, args.node.loc, {
                highlightCode: true,
            })
        );
    }
    msg.push('');
    msg.push(chalk.red(`[Error] 强约束规则 [${link(opts.ruleId, ruleLink)}] 校验失败！`));
    msg.push('');
    msg.push(chalk.red(`  - ${chalk.bold(opts.rule.description)}${args.why ? `但是，${args.why}` : ''}`));
    if (opts.rule.why) {
        msg.push(chalk.red(`  - 为什么要有这条规则？${opts.rule.why}`));
    }
    msg.push(chalk.red(`  - 详见：${ruleLink}`));
    msg.push('');

    msg.push(
        green(
            bold(
                `如需禁用此规则，可在配置 strict.rules 里关闭他，比如：${white(
                    `{ strict: { rules: { ${opts.ruleId}: false } }`
                )}  }。`
            )
        )
    );

    msg.push('');

    return msg.join('\n');
}
