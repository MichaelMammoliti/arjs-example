const css = `.mindar-ui-overlay{display:flex;align-items:center;justify-content:center;position:absolute;left:0;right:0;top:0;bottom:0;background:transparent;z-index:2}.mindar-ui-overlay.hidden{display:none}.mindar-ui-loading .loader{border:16px solid #222;border-top:16px solid white;opacity:.8;border-radius:50%;width:120px;height:120px;animation:spin 2s linear infinite}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.mindar-ui-compatibility .content{background:black;color:#fff;opacity:.8;text-align:center;margin:20px;padding:20px;min-height:50vh}@media (min-aspect-ratio: 1/1){.mindar-ui-scanning .scanning{width:50vh;height:50vh}}@media (max-aspect-ratio: 1/1){.mindar-ui-scanning .scanning{width:80vw;height:80vw}}.mindar-ui-scanning .scanning .inner{position:relative;width:100%;height:100%;opacity:.8;background:linear-gradient(to right,white 10px,transparent 10px) 0 0,linear-gradient(to right,white 10px,transparent 10px) 0 100%,linear-gradient(to left,white 10px,transparent 10px) 100% 0,linear-gradient(to left,white 10px,transparent 10px) 100% 100%,linear-gradient(to bottom,white 10px,transparent 10px) 0 0,linear-gradient(to bottom,white 10px,transparent 10px) 100% 0,linear-gradient(to top,white 10px,transparent 10px) 0 100%,linear-gradient(to top,white 10px,transparent 10px) 100% 100%;background-repeat:no-repeat;background-size:40px 40px}.mindar-ui-scanning .scanning .inner .scanline{position:absolute;width:100%;height:10px;background:white;animation:move 2s linear infinite}@keyframes move{0%,to{top:0%}50%{top:calc(100% - 10px)}}`;

type UIParams = {
  uiLoading: string;
  uiScanning: string;
  uiError: string;
};

export class UI {
  loadingModal: any;
  compatibilityModal: any;
  scanningMask: any;

  constructor({ uiLoading, uiScanning, uiError }: UIParams) {
    const cssBlock = document.createElement('style');
    cssBlock.innerText = css;
    document.head.appendChild(cssBlock);

    if (uiLoading === 'yes') {
      this.loadingModal = this
        ._loadHTML(`<div class="mindar-ui-overlay mindar-ui-loading">
  <div class="loader"/>
</div>
`);
    } else if (uiLoading !== 'no') {
      this.loadingModal = document.querySelector(uiLoading);
    }

    if (uiError === 'yes') {
      this.compatibilityModal = this._loadHTML(`
        <div class="mindar-ui-overlay mindar-ui-compatibility">
  <div class="content">
    <h1>Failed to launch :(</h1>
    <p>
      Looks like your device/browser is not compatible.
    </p>

    <br/>
    <br/>
    <p>
      Please try the following recommended browsers:
    </p>
    <p>
      For Android device - Chrome
    </p>
    <p>
      For iOS device - Safari
    </p>
  </div>
</div>
`);
    } else if (uiError !== 'no') {
      this.compatibilityModal = document.querySelector(uiError);
    }

    if (uiScanning === 'yes') {
      this.scanningMask = this._loadHTML(`
<div class="mindar-ui-overlay mindar-ui-scanning">
  <div class="scanning">
    <div class="inner">
      <div class="scanline"/>
    </div>
  </div>
</div>
`);
    } else if (uiScanning !== 'no') {
      this.scanningMask = document.querySelector(uiScanning);
    }

    this.hideLoading();
    this.hideCompatibility();
    this.hideScanning();
  }

  showLoading() {
    if (!this.loadingModal) return;
    this.loadingModal.classList.remove('hidden');
  }
  hideLoading() {
    if (!this.loadingModal) return;
    this.loadingModal.classList.add('hidden');
  }
  showCompatibility() {
    if (!this.compatibilityModal) return;
    this.compatibilityModal.classList.remove('hidden');
  }
  hideCompatibility() {
    if (!this.compatibilityModal) return;
    this.compatibilityModal.classList.add('hidden');
  }
  showScanning() {
    if (!this.scanningMask) return;
    this.scanningMask.classList.remove('hidden');
  }
  hideScanning() {
    if (!this.scanningMask) return;
    this.scanningMask.classList.add('hidden');
  }

  _loadHTML(html: string): ChildNode {
    const e = document.createElement('template');
    e.innerHTML = html.trim();
    const rootNode = e.content.firstChild;
    document.getElementsByTagName('body')[0].appendChild(rootNode);
    return rootNode;
  }
}
