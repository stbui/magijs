import { IApi } from 'umi';
import { readFileSync } from 'fs';
import { join } from 'path';

export function validate(content: string) {
    return content.includes('defineConfig');
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
                    why: `配置文件 ${configFile} 中没有通过 ${opts.highlight('defineConfig')} 定义配置。`,
                });
            }
        }
        return memo;
    });
};
