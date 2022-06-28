import { IApi, utils } from 'umi';
import globals from 'globals';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

const { t } = utils;

const WHITE_LIST_MAP = {};

['builtin', 'es5', 'es2015', 'es2017', 'browser', 'worker', 'node', 'nodeBuiltin', 'serviceworker'].forEach(key => {
    Object.keys(globals[key]).forEach(k => {
        WHITE_LIST_MAP[k] = 1;
    });
});

['debugger', 'GUmiUIFlag'].forEach(k => {
    WHITE_LIST_MAP[k] = 1;
});

export function BabelPlugin(opts: any) {
    return {
        visitor: {
            ReferencedIdentifier(path: any) {
                const filePath = path.hub.file.opts.filename;
                if (
                    opts.notSrcPathOnly ||
                    isSrcFile({
                        srcPath: opts.srcPath!,
                        filePath,
                    })
                ) {
                    // 忽略 export 语法里的 identifier
                    if (t.isExportSpecifier(path.parent)) {
                        return;
                    }

                    // ref:
                    // https://github.com/babel/babel/blob/6.x/packages/babel-plugin-undeclared-variables-check/src/index.js
                    const { node, scope } = path;

                    if (WHITE_LIST_MAP[node.name]) return;
                    if (scope.hasBinding(node.name)) return;

                    throw new Error(
                        `\n` +
                            opts.getErrorMsg!({
                                why: `源码中有使用未声明的变量 ${opts.highlight!(node.name)} 。`,
                                path,
                            })
                    );
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
