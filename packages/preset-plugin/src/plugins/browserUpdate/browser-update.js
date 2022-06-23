export default `
(function () {
  function matchBrowser() {
    var uaExp = {{{ UARegExp }}};
    // ignore crawlers
    var botExp = {{{ BotExp }}};
    if (typeof navigator !== 'undefined') {
      // exclude browsers
      if (botExp.test(navigator.userAgent)) {
        return false;
      }
      if (uaExp instanceof RegExp) {
        return !uaExp.test(navigator.userAgent);
      }
    }
    // skip if UAExp error
    return false;
  }

  function renderBrowserUpdate() {
    var div = document.createElement('div');
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    var styleContent = 'html, body { width: 100%; height: 100%; overflow: hidden; }.legacy-warn { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 999999; }  .legacy-container {      position: relative;    width: 940px;      margin: 150px auto;  }  .legacy-close {      position: absolute;    right: -16px;    top: -32px;    cursor: pointer;   }  .legacy-img { width: 438px; float: left;  margin-right: 16px;}.legacy-tips{float: right;}.legacy-img img {min-width: 100%; max-width: 100%;}.legacy-tips-title { margin-bottom: .5em; color: rgba(0,0,0,.85); font-weight: 600; font-size: 30px;line-height: 1.35;}.legacy-tips-desc {  margin: 8px 0 24px;color: rgba(0,0,0,.45);font-size: 16px;  line-height: 24px;}.legacy-browsers {  margin-top: 40px;}.legacy-browsers li {  display: inline-block;  text-align: center;  width: 44px;  margin-right: 32px;}.legacy-browsers a {  color: rgba(0, 0, 0, 0.65); text-decoration: none; }.legacy-browsers img { margin-bottom: 8px;}';
    // support IE 8
    if (style.styleSheet) {
      style.styleSheet.cssText = styleContent;
    } else {
      style.innerHTML = styleContent;
    }


    div.innerHTML =
      '<div class="legacy-warn"><div class="legacy-container"><div class="legacy-close" id="legacy-close">X</div><div class="legacy-img"><img src="https://gw.alipayobjects.com/mdn/rms_defc2e/afts/img/A*vU2YQp24hpIAAAAAAAAAAABkARQnAQ" alt="" width="438" height="268" ></div><div class="legacy-tips"><p class="legacy-tips-title">浏览器版本不兼容</p><p class="legacy-tips-desc">浏览器版本过低，为避免可能存在的安全隐患，推荐升级以下浏览器</p><ul class="legacy-browsers"><li><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/chrome/"><img src="https://gw.alipayobjects.com/mdn/rms_66ee3f/afts/img/A*DU8tSpLpRHYAAAAAAAAAAABkARQnAQ" alt="" width="32" height="32"><span>Chrome</span></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://www.microsoft.com/edge"><img src="https://gw.alipayobjects.com/zos/antfincdn/F2rupPM9KL/Microsoft_Edge_Logo.png" alt="" width="32" height="32"><span>Edge</span></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://support.apple.com/downloads/safari"><img src="https://gw.alipayobjects.com/mdn/rms_66ee3f/afts/img/A*TN2-R5PECp0AAAAAAAAAAABkARQnAQ" alt="" width="32" height="32"><span>Safari</span></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://www.mozilla.org/exp/firefox/new/"><img src="https://gw.alipayobjects.com/mdn/rms_66ee3f/afts/img/A*m0yRSZUoWFMAAAAAAAAAAABkARQnAQ" alt="" width="32" height="32"><span>Firefox</span></a></li></div></div></div></div>';

    document.body.appendChild(style);
    document.body.appendChild(div);

    var closeEle = document.getElementById('legacy-close');
    if (closeEle) {
      closeEle.onclick = function () {
        document.body.removeChild(div);
        document.body.removeChild(style);
      };
    }
  }

  try {
    if (matchBrowser()) {
      renderBrowserUpdate();
    }
  } catch (e) {
    console.error('[BrowserUpdate ERROR]', navigator.userAgent, e);
  }
})();
`;
