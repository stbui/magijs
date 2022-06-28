import { IApi, utils } from 'umi';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

const { t } = utils;

export function BabelPlugin(opts: any) {
    return {
        visitor: {
            Program: {
                enter(path: any) {
                    const filePath = path.hub.file.opts.filename;
                    if (
                        opts.notSrcPathOnly ||
                        isSrcFile({
                            srcPath: opts.srcPath!,
                            filePath,
                        })
                    ) {
                        path.node.body.forEach((node: any) => {
                            if (
                                t.isExpressionStatement(node) &&
                                t.isAssignmentExpression(node.expression) &&
                                t.isMemberExpression(node.expression.left) &&
                                t.isIdentifier(node.expression.left.object) &&
                                t.isIdentifier(node.expression.left.property) &&
                                // exports.foo = ...;
                                (node.expression.left.object.name === 'exports' ||
                                    // module.exports = ...;
                                    (node.expression.left.object.name === 'module' &&
                                        node.expression.left.property.name === 'exports'))
                            ) {
                                throw new Error(
                                    `\n` +
                                        opts.getErrorMsg!({
                                            why: '源码中不允许出现 exports.xxx 或 module.exports = ... 。',
                                            node,
                                            path,
                                        })
                                );
                            }

                            if (
                                t.isVariableDeclaration(node) &&
                                node.declarations.some((d: any) => {
                                    return (
                                        t.isVariableDeclarator(d) &&
                                        d.init &&
                                        // @ts-ignore
                                        d.init.callee &&
                                        // @ts-ignore
                                        t.isIdentifier(d.init.callee) &&
                                        // @ts-ignore
                                        d.init.callee.name === 'require'
                                    );
                                })
                            ) {
                                throw new Error(
                                    `\n` +
                                        opts.getErrorMsg!({
                                            why: '源码中不允许通过 require 引用其他模块。',
                                            node,
                                            path,
                                        })
                                );
                            }

                            if (
                                t.isExpressionStatement(node) &&
                                t.isCallExpression(node.expression) &&
                                t.isIdentifier(node.expression.callee) &&
                                node.expression.callee.name === 'require'
                            ) {
                                throw new Error(
                                    `\n` +
                                        opts.getErrorMsg!({
                                            why: '源码中不允许通过 require 引用其他模块。',
                                            node,
                                            path,
                                        })
                                );
                            }
                        });
                    }
                },
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
