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
                        /\.(css|less|stylus)/.test(node.source.value) &&
                        // is relative
                        node.source.value.charAt(0) === '.'
                    ) {
                        throw new Error(
                            `\n` +
                                opts.getErrorMsg!({
                                    why: `源码中出现了对 ${opts.highlight!(node.source.value)} 的引用。`,
                                })
                        );
                    }
                }
            },
        },
    };
}

export default (api: IApi, opts) => {
    addPreset({
        api,
        opts,
        BabelPlugin,
    });
};
