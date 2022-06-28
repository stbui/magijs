export default () => `
import vw from 'umi-hd/lib/vw';
import flex from 'umi-hd/lib/flex';

if (typeof document !== 'undefined') {
  const getViewPort = (str?: string) => {
    if (!str) return {};
    const arr = str.split(',');
    const hashArr = {};
    arr.forEach(s => {
      const ss = s.split('=');
      hashArr[ss[0].replace(/(^\s*)|(\s*$)/g, '')] = ss[1];
    });
    return hashArr;
  };

  // 自动处理页面使用 iframe 嵌套缩放问题
  if (window != top && !window.magiFontScale) {
    // window.magiFontScale = 0.5;
    const meta = document.querySelector('meta[name="viewport"]');
    const metaStr = meta.getAttribute('content') || '';
    const viewport = getViewPort(metaStr);
    if (viewport['initial-scale']) {
      const dpr = window.devicePixelRatio || 1;
      const baseScale = 10 / dpr;
      window.magiFontScale = baseScale / parseInt(parseFloat(viewport['initial-scale']) * 10, 10);
    }
  }
  // if (document.documentElement.clientWidth >= 750) {
  //   vw(100, 750);
  // } else {
  //   flex(100, window.magiFontScale || 1);
  // }
  // 感觉全部用 flex 就很棒，嵌套页面缩放问题，直接设置 magiFontScale
  flex(100, window.magiFontScale || 1);
  // hd solution for antd-mobile@2
  document.documentElement.setAttribute('data-scale', true);
}
`;
