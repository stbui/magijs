import { IApi } from 'umi';
import { join } from 'path';
import { existsSync } from 'fs';

export function validate() {}

export default (api: IApi, opts: any) => {
    api.onPluginReady(() => {
        let invalidTypingFile: any = null;
        if (existsSync(join(api.cwd, 'typings.d.ts'))) {
            invalidTypingFile = 'typings.d.ts';
        }
        if (existsSync(join(api.cwd, 'src/typings.d.ts'))) {
            invalidTypingFile = 'src/typings.d.ts';
        }

        if (invalidTypingFile) {
            return opts.printError({
                exit: true,
                why: `项目中出现 ${opts.highlight(invalidTypingFile)} 文件，请移到 src/typings/global.d.ts 。`,
            });
        }
    });
};
