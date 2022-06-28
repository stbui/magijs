import { IApi } from 'umi';

export default function addPreset(args: { api: IApi; BabelPlugin: Function; opts; args?: Object }) {
    const { api, BabelPlugin, opts } = args;
    api.modifyBabelPresetOpts(memo => {
        return {
            ...memo,
            modify(preset: any) {
                const ret = {
                    ...preset,
                    presets: [
                        {
                            plugins: [
                                BabelPlugin.bind(null, {
                                    srcPath: api.paths.absSrcPath!,
                                    getErrorMsg: opts.getErrorMsg,
                                    highlight: opts.highlight,
                                    ...(args.args ? args.args : {}),
                                }) as any,
                            ],
                        },
                        ...preset.presets,
                    ],
                };
                return memo.modify ? memo.modify(ret) : ret;
            },
        };
    });
}
