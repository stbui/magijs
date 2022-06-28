import { IApi, IConfig } from 'umi';

export function validate(userConfig: IConfig) {
    const keys = Object.keys(userConfig);
    keys.forEach(key => {
        if (!['dva', 'layout'].includes(key) && userConfig[key] === false) {
            throw new Error(`配置里通过设置 ${key}: false 禁用了 ${key} 。`);
        }
    });
}

export default (api: IApi, opts: any) => {
    api.modifyConfig(memo => {
        try {
            validate(api.userConfig);
        } catch (e) {
            opts.printError({
                exit: true,
                why: e.message,
            });
        }
        return memo;
    });
};
