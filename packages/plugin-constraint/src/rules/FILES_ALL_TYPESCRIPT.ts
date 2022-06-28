import { IApi, utils } from 'umi';
import isSrcFile from '../isSrcFile';
import addPreset from '../addPreset';

export function BabelPlugin(opts) {
    return {
        visitor: {
            Program(path: any) {
                const filePath = path.hub.file.opts.filename;
                if (
                    opts.notSrcPathOnly ||
                    isSrcFile({
                        srcPath: opts.srcPath!,
                        filePath,
                    })
                ) {
                    if (/\.jsx?$/.test(filePath)) {
                        throw new Error(
                            `\n` +
                                opts.getErrorMsg!({
                                    why: `源码中了出现 ${opts.highlight!(filePath)} 文件，请修改为 .ts 或 .tsx 文件。`,
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
