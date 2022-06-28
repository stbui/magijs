import { IApi } from 'umi';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

function isRuleDisable(val: any) {
    function isOff(val: any) {
        return val === false || val === 'off' || val === 0;
    }
    return Array.isArray(val) ? isOff(val[0]) : isOff(val);
}

export function validate(content: string) {
    let rc: any;
    try {
        rc = JSON.parse(content);
    } catch (e) {
        throw new Error(`.eslintrc 解析失败。`);
    }

    if (rc.extends !== '@magi/magi/eslint') {
        throw new Error(`.eslintrc 里必须 extends @magi/magi/eslint。`);
    }

    Object.keys(rc.rules || {}).forEach(key => {
        const rule = rc.rules[key];
        if (isRuleDisable(rule)) {
            throw new Error(`.eslintrc 里关闭了规则 ${key}。`);
        }
    });
}

export default (api: IApi, opts: any) => {
    api.onPluginReady(() => {
        const filePath = join(api.cwd, '.eslintrc');

        if (!existsSync(filePath)) {
            return opts.printError({
                exit: true,
                why: `项目中不存在 ${opts.highlight('.eslintrc')} 文件。`,
            });
        }

        const content = readFileSync(filePath, 'utf-8');
        try {
            validate(content);
        } catch (e) {
            opts.printError({
                exit: true,
                why: e.message,
            });
        }
    });
};
