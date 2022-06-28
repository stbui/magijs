import { IApi, utils } from 'umi';

interface IConfig {
    [key: string]: any;
}

const LIMITED_KEYS = [
    'autoprefixer',
    'cssnano',
    'extraBabelPlugins',
    'extraBabelPresets',
    'extraPostCSSPlugins',
    'inlineLimit',
    'mountElementId',
    'presets',
    'polyfill',
    'singular',
    'terserOptions',
];

export function validate(userConfig: IConfig) {
    const keys = Object.keys(userConfig);
    const intersection = utils.lodash.intersection(keys, LIMITED_KEYS);
    if (intersection.length) {
        throw new Error(
            JSON.stringify({
                keys: intersection,
            })
        );
    }
}

export default (api: IApi, opts: any) => {
    api.modifyConfig(memo => {
        try {
            // 注意：校验的是用户定义的 api.userConfig
            validate(api.userConfig);
        } catch (e) {
            const { keys } = JSON.parse(e.message);
            opts.printError({
                exit: true,
                why: `配置里定义了 ${opts.highlight(keys.join(', '))} 。`,
            });
        }
        return memo;
    });
};
