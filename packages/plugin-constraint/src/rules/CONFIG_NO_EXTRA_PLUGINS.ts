import { IApi, IConfig, utils } from 'umi';

const whitelist = ['@umijs/plugin-sass'];

function isValidPlugin(dep: string) {
    if (/^umi-plugin-/.test(dep)) return true;
    if (/^@[^\/]+\/(umi-)?plugin-/.test(dep)) return true;
    if (/^@[^\/]+\/(magi-)?plugin-/.test(dep)) return true;
    return false;
}

function getPluginPkgs(deps: string[]) {
    return deps.filter(isValidPlugin);
}

export function validatePkg(pkg: any) {
    const plugins = utils.lodash.uniq(
        utils.lodash.concat(
            getPluginPkgs(Object.keys(pkg.dependencies || {})),
            getPluginPkgs(Object.keys(pkg.devDependencies || {}))
        )
    );
    const invalidPlugins = utils.lodash.without(plugins, ...whitelist);
    if (invalidPlugins.length) {
        throw new Error(`package.json 中依赖了 ${invalidPlugins.join(', ')} 插件。`);
    }
}

export function validateConfig(userConfig: IConfig) {
    const invalidPlugins = utils.lodash.without(userConfig.plugins || [], ...whitelist);
    if (invalidPlugins.length) {
        throw new Error(`配置里配了 ${invalidPlugins.join(', ')} 插件。`);
    }
}

export default (api: IApi, opts: any) => {
    api.onPluginReady(() => {
        try {
            validateConfig(api.userConfig);
            validatePkg(api.pkg);
        } catch (e) {
            opts.printError({
                exit: true,
                why: e.message,
            });
        }
    });
};
