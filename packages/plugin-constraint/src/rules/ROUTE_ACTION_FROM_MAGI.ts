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
                        /^(dva\/router|react-router|react-router-dom)/.test(node.source.value)
                    ) {
                        throw new Error(
                            `\n` +
                                opts.getErrorMsg!({
                                    why: '源码中出现对 react-router、react-router-dom 或 dva/router 的引用。',
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
