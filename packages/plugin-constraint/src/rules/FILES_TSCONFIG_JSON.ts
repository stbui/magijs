import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { parse } from '@magijs/compiled/comment-json';

export function validate(tsconfig: any) {
    if (!tsconfig.compilerOptions) {
        throw new Error(`compilerOptions 未定义。`);
    }
    if (!tsconfig.compilerOptions.paths) {
        throw new Error(`compilerOptions.paths 未定义。`);
    }
    const paths1 = tsconfig.compilerOptions.paths['@/*'];
    const paths2 = tsconfig.compilerOptions.paths['@@/*'];
    if (paths1.length !== 1 || (paths1[0] !== './src/*' && paths1[0] !== 'src/*')) {
        throw new Error(`compilerOptions.paths 里没有定义 @/* 或值不是 ./src/* 。`);
    }
    if (paths2.length !== 1 || (paths2[0] !== './src/.magi/*' && paths2[0] !== 'src/.magi/*')) {
        throw new Error(`compilerOptions.paths 里没有定义 @@/* 或值不是 ./src/.magi/* 。`);
    }
}

export default (api, opts) => {
    api.onPluginReady(() => {
        const filePath = join(api.cwd, 'tsconfig.json');

        if (!existsSync(filePath)) {
            opts.printError({
                exit: true,
                why: `项目中没有 tsconfig.json 文件。`,
            });
            return;
        }

        const content = readFileSync(filePath, 'utf-8');
        let tsconfig;
        try {
            tsconfig = parse(content);
        } catch (e) {
            opts.printError({
                exit: true,
                why: `tsconfig.json 解析失败，不是合法的 json 文件。`,
            });
            return;
        }

        try {
            validate(tsconfig);
        } catch (e) {
            opts.printError({
                exit: true,
                why: e.message,
            });
        }
    });
};
