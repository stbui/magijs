// const tmp = '<html><header><script>/* MAGI_APP_INFO */</script></header></html>';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { load } from 'cheerio';

function getScriptConfig(config) {
  const { layout, define, publicPath } = config;

  return {
    env: {
      SHIP_DEPLOY_ENV: process.env.DEPLOY_ENV,
      NODE_ENV: process.env.NODE_ENV,
    },
    config: {
      layout: layout !== undefined,
    },
    define,
    publicPath,
  };
}

export function modifyHtmlContent(api) {
  api.addHTMLHeadScripts(() => [
    {
      content: '/* MAGI_APP_INFO */',
      id: 'magi_app_info',
    },
  ]);

  api.modifyHTML($ => {
    const scriptContent = getScriptConfig(api.userConfig);
    $('#magi_app_info').text(`window.MAGI_APP_INFO=${JSON.stringify(scriptContent)}`);
    return $;
  });
}

export function modifyHtml(config) {
  const { outputPath } = config;
  const path = outputPath || './dist';
  const absPath = join(process.cwd(), path, 'index.html');

  const html = readFileSync(absPath, { encoding: 'utf-8' });
  const $ = load(html);
  const scriptContent = getScriptConfig(config);
  $('#magi_app_info').text(`window.MAGI_APP_INFO=${JSON.stringify(scriptContent)};`);

  writeFileSync(absPath, $.html(), { encoding: 'utf-8' });
}
