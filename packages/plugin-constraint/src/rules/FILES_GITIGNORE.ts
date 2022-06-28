import { IApi } from 'umi';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const ignores = ['node_modules', 'dist', '.magi', '.magi-production'];

export function validate(content: string) {
    const lines = content.split('\n');
    return ignores.filter(ignore => {
        return !lines.some((line: string) => {
            return line.includes(ignore);
        });
    });
}

export default (api: IApi, opts) => {
    api.onPluginReady(() => {
        const filePath = join(api.cwd, '.gitignore');

        if (!existsSync(filePath)) {
            return opts.printError({
                exit: true,
                why: `项目中不存在 ${opts.highlight('.gitignore')} 文件。`,
            });
        }

        const content = readFileSync(filePath, 'utf-8');
        const lostIgnores = validate(content);
        if (lostIgnores.length) {
            return opts.printError({
                exit: true,
                why: `.gitignore 中没有出现 ${opts.highlight(lostIgnores.join(', '))} 。`,
            });
        }
    });
};
