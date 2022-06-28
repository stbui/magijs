import { IApi, utils } from 'umi';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

const { t } = utils;

function isVoid0(node) {
    return (
        t.isUnaryExpression(node) &&
        node.operator === 'void' &&
        t.isNumericLiteral(node.argument) &&
        node.argument.value === 0
    );
}

function isConditionalExpression(node) {
    return (
        t.isConditionalExpression(node) && !isVoid0(node.test) && !isVoid0(node.consequent) && !isVoid0(node.alternate)
    );
}

export function BabelPlugin(opts: any) {
    return {
        visitor: {
            ConditionalExpression: {
                enter(path: any) {
                    const filePath = path.hub.file.opts.filename;
                    if (
                        opts.notSrcPathOnly ||
                        isSrcFile({
                            srcPath: opts.srcPath!,
                            filePath,
                        })
                    ) {
                        const test = path.node.test;
                        const consequent = path.node.consequent;
                        const alternate = path.node.alternate;

                        // 支持 OptionalMemberExpression 的编译结果
                        // e.g. history?.location?.query
                        if (isVoid0(consequent) || isVoid0(alternate)) {
                            return;
                        }

                        if (
                            isConditionalExpression(test) ||
                            isConditionalExpression(consequent) ||
                            isConditionalExpression(alternate)
                        ) {
                            throw new Error(
                                `\n` +
                                    opts.getErrorMsg!({
                                        why: `源码中不允许出现三元表达式嵌套`,
                                        path,
                                    })
                            );
                        }
                    }
                },
            },
        },
    };
}

export default (api: IApi, opts: any) => {
    addPreset({
        api,
        BabelPlugin,
        opts,
    });
};
