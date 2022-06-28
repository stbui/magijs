import { IApi, utils } from 'umi';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

const { t } = utils;

function isRelative(path: string): boolean {
    if (path.charAt(0) === '.') return true;
    if (path.startsWith('@/')) return true;
    if (path.startsWith('@@/')) return true;
    return false;
}

export function BabelPlugin(opts: any) {
    return {
        visitor: {
            ImportDeclaration(path: any) {
                const filePath = path.hub.file.opts.filename;
                if (
                    opts.notSrcPathOnly ||
                    isSrcFile({
                        srcPath: opts.srcPath!,
                        filePath,
                    })
                ) {
                    const { node } = path;
                    if (
                        t.isStringLiteral(node.source) &&
                        // .scss 的约束通过其他规则实现
                        node.source.value.endsWith('.scss') &&
                        isRelative(node.source.value) &&
                        node.specifiers.length === 0
                    ) {
                        throw new Error(
                            `\n` +
                                opts.getErrorMsg!({
                                    why: '源码中出现了针对 scss 文件的非 css modules 引用方式。',
                                    path,
                                })
                        );
                    }
                }
            },
        },
    };
}

export default (api: IApi, opts: any) => {
    addPreset({
        api,
        opts,
        BabelPlugin,
    });
};
