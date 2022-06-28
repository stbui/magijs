import { IApi } from 'umi';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

export function validate(content: string) {
    return content.trim() === `module.exports = require('@magi/magi/prettier');`;
}

export default (api: IApi, opts: any) => {
    api.onPluginReady(() => {
        const filePath = join(api.cwd, '.prettierrc.js');

        if (!existsSync(filePath)) {
            return opts.printError({
                exit: true,
                why: `项目中不存在 ${opts.highlight('.prettierrc.js')} 文件。`,
            });
        }

        const content = readFileSync(filePath, 'utf-8');
        if (!validate(content)) {
            return opts.printError({
                exit: true,
                why: `.prettierrc.js 被修改。`,
            });
        }
    });
};
