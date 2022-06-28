import { IApi } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';

export function validate(content: string) {
    return !(content.includes('exports.') || content.includes('module.exports') || content.includes('require('));
}

export default (api: IApi, opts: any) => {
    api.modifyConfig(memo => {
        const configFile = api.service.configInstance.configFile;
        if (configFile) {
            const configFilePath = join(api.cwd, configFile);
            const content = readFileSync(configFilePath, 'utf-8');
            if (!validate(content)) {
                opts.printError({
                    exit: true,
                    why: `配置文件 ${configFile} 中有使用 require() 来引入模块或通过 exports. 和 module.exports 来导出配置。`,
                });
            }
        }
        return memo;
    });
};
