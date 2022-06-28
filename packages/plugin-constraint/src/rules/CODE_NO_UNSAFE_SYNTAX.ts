import { IApi, utils } from 'umi';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

const { t } = utils;

export function BabelPlugin(opts: any) {
    return {
        visitor: {
            CallExpression(path: any) {
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
                        t.isIdentifier(node.callee, { name: 'eval' }) ||
                        (t.isMemberExpression(node.callee) &&
                            t.isIdentifier(node.callee.property, { name: 'eval' }) &&
                            t.isIdentifier(node.callee.object) &&
                            ['window', 'self', 'top'].includes(node.callee.object.name))
                    ) {
                        throw new Error(
                            `\n` +
                                opts.getErrorMsg!({
                                    why: '源码中不允许出现 eval() 的调用。',
                                    path,
                                })
                        );
                    }
                }
            },
            NewExpression(path: any) {
                const filePath = path.hub.file.opts.filename;
                if (
                    opts.notSrcPathOnly ||
                    isSrcFile({
                        srcPath: opts.srcPath!,
                        filePath,
                    })
                ) {
                    const { node } = path;
                    if (t.isIdentifier(node.callee) && node.callee.name === 'Function') {
                        throw new Error(
                            `\n` +
                                opts.getErrorMsg!({
                                    why: '源码中不允许出现 new Function() 。',
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
