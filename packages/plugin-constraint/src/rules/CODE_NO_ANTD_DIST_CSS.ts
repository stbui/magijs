import { IApi, utils } from 'umi';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

const { t } = utils;

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
                        /antd\/dist\/antd(\.compact)?(\.dark)?(\.min)?\.(css|less)$/.test(node.source.value)
                    ) {
                        throw new Error(
                            `\n` +
                                opts.getErrorMsg!({
                                    why: '源码中手动引入了 antd 的 css 或 less 。',
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
