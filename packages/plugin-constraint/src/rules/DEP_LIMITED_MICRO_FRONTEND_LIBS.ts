import { IApi } from 'umi';
import checkDepLimitedLibs from '../checkDepLimitedLibs';

const INVALID_PKGS = ['single-spa', '@luigi-project/', 'oc', '@ice/'];

export default (api: IApi, opts: any) => {
    api.onPluginReady(async () => checkDepLimitedLibs(api, opts, INVALID_PKGS));
};
