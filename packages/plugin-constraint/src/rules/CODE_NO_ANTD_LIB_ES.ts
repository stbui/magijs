import { IApi, utils } from 'umi';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

const { t } = utils;

function isAndLibEs(path: string) {
    return /^(antd|@alipay\/bigfish\/antd)\//.test(path) && /^(antd|@alipay\/bigfish\/antd)\/(lib|es)\//.test(path);
}

function isAndLibEsWhitelist(path: string) {
    return (
        /^(antd|@alipay\/bigfish\/antd)\//.test(path) &&
        /^(antd|@alipay\/bigfish\/antd)\/(lib|es)\/(locale)\//.test(path)
    );
}

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
                        const { node } = path;
                        node.body.forEach((n: any) => {
                            if (
                                t.isImportDeclaration(n) &&
                                t.isStringLiteral(n.source) &&
                                isAndLibEs(n.source.value) &&
                                !isAndLibEsWhitelist(n.source.value) &&
                                n.specifiers.some((specifier: any) => {
                                    return t.isImportDefaultSpecifier(specifier);
                                })
                            ) {
                                throw new Error(
                                    `\n` +
                                        opts.getErrorMsg!({
                                            why: '源码中出现对 antd/lib/ 或 antd/es/ 的引用。',
                                            path,
                                            node: n,
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
