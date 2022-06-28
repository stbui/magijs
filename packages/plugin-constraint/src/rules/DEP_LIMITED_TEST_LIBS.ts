import { IApi } from 'umi';
import checkDepLimitedLibs from '../checkDepLimitedLibs';

const INVALID_PKGS = ['jest', 'mocha', 'chai', 'istanbul'];

export default (api: IApi, opts: any) => {
    api.onPluginReady(async () => checkDepLimitedLibs(api, opts, INVALID_PKGS));
};
