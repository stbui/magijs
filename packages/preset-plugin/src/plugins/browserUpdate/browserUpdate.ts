import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { IApi, utils, BundlerConfigType, IConfig } from 'umi';
import { getUserAgentRegExp } from 'browserslist-useragent-regexp';
import { getTargetsAndBrowsersList } from '@umijs/bundler-utils';
import browserUpdate from './browser-update';

const { Mustache } = utils;

// for test, ref: https://github.com/browser-update/browser-update/blob/master/scripts/update.js#L17-L19
export const BOT_EXP = new RegExp(
    'Pagespeed|pingdom|Preview|ktxn|dynatrace|Ruxit|PhantomJS|Headless|Lighthouse|bot|spider|archiver|transcoder|crawl|checker|monitoring|prerender|screenshot|python-|php|uptime|validator|fetcher|facebook|slurp|google|yahoo|node|mail.ru|github|cloudflare|addthis|thumb|proxy|feed|fetch|favicon|link|http|scrape|seo|page|search console|AOLBuild|Teoma|Expeditor',
    'i'
);

/**
 * 从 targets 配置生成浏览器 UA 正则表达式
 * 匹配 navigator.userAgent 是否符合 targets 圈定的浏览器范围
 * @param targets config/config.ts 里的 targets 配置，默认是 umi 里的
 */
export const getTargetsRegExp = (targets: object): RegExp => {
    const { browserslist } = getTargetsAndBrowsersList({
        // 只用到了 targets
        config: {
            targets,
        } as IConfig,
        type: BundlerConfigType.csr,
    });
    return getUserAgentRegExp({
        browsers: browserslist,
        allowHigherVersions: true,
    });
};

const tmpBrowserUpdatePath = 'preset-zajs/browserUpdate/browserUpdate.js';

export default (api: IApi) => {
    api.describe({
        key: 'browserUpdate',
        config: {
            schema(joi) {
                return joi.object();
            },
        },
        enableBy: api.EnableBy.config,
    });

    // 写到临时文件里，便于开发者排查
    api.onGenerateFiles(() => {
        const UARegExp = getTargetsRegExp(api.config.targets || {});
        const browserUpdateContent = Mustache.render(browserUpdate, {
            // 判断的原因：防止生成的正则报错，直接在渲染前就抛错了
            UARegExp: UARegExp instanceof RegExp ? UARegExp : '',
            BotExp: BOT_EXP,
        });
        // 这里一定是 js，因为不走编译
        api.writeTmpFile({
            path: tmpBrowserUpdatePath,
            content: browserUpdateContent,
        });
    });

    api.addHTMLScripts({
        fn: () => {
            const browserUpdatePath = join(api.paths.absTmpPath!, tmpBrowserUpdatePath);

            const updateScript = existsSync(browserUpdatePath) ? readFileSync(browserUpdatePath, 'utf-8') : '';

            return updateScript
                ? [
                      {
                          content: updateScript,
                      },
                  ]
                : [];
        },
        // 放在最后去执行，这样可以加到最顶部
        stage: 1,
    });
};
