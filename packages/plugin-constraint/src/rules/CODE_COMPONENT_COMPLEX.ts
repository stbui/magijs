import { IApi, utils } from 'umi';
import addPreset from '../addPreset';

function isComponent(filePath: string) {
    return utils.winPath(filePath).split('/').includes('components');
}

export function BabelPlugin(opts) {
    return {
        visitor: {
            Program(path: any) {
                const filePath = path.hub.file.opts.filename.replace(opts.srcPath! + '/', '');
                const lines = path.hub.file.code.split('\n').length;
                if (isComponent(filePath) && lines > 400) {
                    throw new Error(
                        `\n` +
                            opts.getErrorMsg!({
                                why: `文件 ${filePath} 文件行数为 ${lines} 。`,
                            })
                    );
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
