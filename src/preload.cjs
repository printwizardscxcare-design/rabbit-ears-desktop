'use strict';

// Runs in an isolated world. No Node or IPC functions are exposed to the site.
const { ipcRenderer } = require('electron');
if(process.isMainFrame && typeof installWindowChrome==='function')installWindowChrome({ipcRenderer,document,window});
if (location.origin === 'https://rabbit-ears.stream' && process.isMainFrame) {
  if (typeof installAudio === 'function') installAudio({ipcRenderer,document,window,model:AudioModel,createGraph:createAudioGraph,workletSource:DENOISE_WORKLET});
  installStreamCaptions({ipcRenderer,document,window});
  let bufferedCaptions;
  ipcRenderer.on('desktop:caption-rewind', () => {
    const rewind = document.querySelector('#back');
    if (rewind && !rewind.disabled) { rewind.click(); return; }
    // The compact guide player may not expose the full player's rewind button.
    const video = document.querySelector('#vid');
    if (!video || !Number.isFinite(video.currentTime)) return;
    const start = video.seekable?.length ? video.seekable.start(0) : 0;
    video.currentTime = Math.max(start, video.currentTime - 15);
  });
  if (document.addEventListener) {
    for (const eventName of ['pause', 'playing', 'seeking', 'emptied']) document.addEventListener(eventName, event => {
      if (event.target !== document.querySelector('#vid')) return;
      ipcRenderer.send('controls:playback', ['pause', 'playing'].includes(eventName) ? eventName : 'reset');
    }, true);
    let overlay;
    let exitFullscreen;
    let line;
    let cooldownBadge, cooldownLabel;
    let measureContext;
    const pages = new CaptionPages({ now: () => performance.now() });
    let state = { enabled: false, color: 'white', size: 1, text: '' };
    const place = () => {
      if (!overlay) return;
      const root = document.fullscreenElement || document.documentElement;
      if (overlay.parentNode !== root) root.appendChild(overlay);
      const video = document.querySelector('#vid');
      const rectangle = video?.getBoundingClientRect();
      const fullscreen = !!document.fullscreenElement;
      const visibleVideo = rectangle && rectangle.width > 0 && rectangle.height > 0 && rectangle.bottom > 0 && rectangle.top < innerHeight;
      if (cooldownBadge) {
        if (cooldownBadge.parentNode !== root) root.appendChild(cooldownBadge);
        const remaining = bufferedCaptions?.cooldown?.() || 0;
        const tuning = bufferedCaptions?.waitingForTune?.() || false;
        cooldownLabel.textContent = tuning ? 'Subtitles after tuning' : remaining ? `Subtitles in ${remaining}s` : '';
        cooldownBadge.style.display = state.enabled && (remaining || tuning) && (fullscreen || visibleVideo) ? 'block' : 'none';
        cooldownBadge.style.right = `${fullscreen ? 20 : Math.max(0, innerWidth - (rectangle?.right ?? (rectangle?.left || 0) + (rectangle?.width || 0))) + 12}px`;
        cooldownBadge.style.bottom = `${fullscreen ? 80 : Math.max(0, innerHeight - (rectangle?.bottom || 0)) + 18}px`;
        cooldownBadge.style.maxWidth = `${Math.max(0, (fullscreen ? innerWidth : rectangle?.width || 0) - 40)}px`;
      }
      overlay.style.left = fullscreen ? '0px' : `${Math.max(0, rectangle?.left || 0)}px`;
      overlay.style.width = fullscreen ? '100%' : `${rectangle?.width || 0}px`;
      overlay.style.bottom = fullscreen ? '8%' : `${Math.max(0, innerHeight - (rectangle?.bottom || 0)) + Math.max(18, (rectangle?.height || 0) * .06)}px`;
      if (line) {
        const width = fullscreen ? innerWidth : rectangle?.width || 900;
        const fontSize = (fullscreen ? Math.max(24, Math.min(80, innerHeight * .04)) : Math.max(20, Math.min(42, width * .026))) * state.size;
        measureContext.font = `600 ${fontSize}px "Segoe UI",sans-serif`;
        const availableWidth = Math.max(1, width * (fullscreen ? .9 : .86) - 4);
        const measure = text => measureContext.measureText(text).width;
        const page = bufferedCaptions?.render(availableWidth,measure) || pages.render(availableWidth,measure);
        line.style.fontSize = `${fontSize * page.scale}px`;
        line.style.maxWidth = fullscreen ? '90%' : '86%';
        line.textContent = page.text;
        overlay.style.display = state.enabled && page.text && (fullscreen || visibleVideo) ? 'flex' : 'none';
      }
    };
    const ensureOverlay = () => {
      if (overlay || !document.documentElement) return;
      overlay = document.createElement('div');
      overlay.id = 'rabbit-ears-desktop-caption-overlay';
      overlay.style.cssText = 'position:fixed;z-index:2147483647;pointer-events:none!important;background:transparent!important;justify-content:center;align-items:flex-end;box-shadow:none!important;border:0!important;margin:0!important;padding:0!important;';
      const shadow = overlay.attachShadow({ mode: 'closed' });
      const style = document.createElement('style');
      style.textContent = ':host{background:transparent!important;pointer-events:none!important}span{display:block;max-width:86%;background:transparent!important;border:0;box-shadow:none;padding:0;margin:0;text-align:center;font:600 clamp(22px,2.6vw,42px)/1.25 "Segoe UI",sans-serif;letter-spacing:normal;word-spacing:normal;white-space:pre;text-wrap:nowrap;text-shadow:0 1px 3px #000,1px 0 2px #000,-1px 0 2px #000,0 -1px 2px #000;}';
      line = document.createElement('span');
      measureContext = document.createElement('canvas').getContext('2d');
      shadow.append(style, line);
      cooldownBadge = document.createElement('div');
      cooldownBadge.id = 'rabbit-ears-desktop-subtitle-cooldown';
      cooldownBadge.style.cssText = 'position:fixed;z-index:2147483647;pointer-events:none!important;';
      const badgeShadow = cooldownBadge.attachShadow({mode:'closed'});
      const badgeStyle = document.createElement('style');
      badgeStyle.textContent = 'span{display:block;padding:6px 10px;background:#21285ae6;color:#ffff00;border:1px solid #2652b2;font:clamp(14px,1.4vw,22px) Star4000,"Courier New",monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}';
      cooldownLabel = document.createElement('span');
      badgeShadow.append(badgeStyle,cooldownLabel);
      place();
    };
    ipcRenderer.on('desktop:captions', (_event, incoming) => {
      if (!incoming || typeof incoming.text !== 'string') return;
      let text = incoming.text.replace(/\s+/g, ' ').trim();
      state = { enabled: incoming.enabled === true, color: incoming.color === 'yellow' ? 'yellow' : 'white',
        size: [0.8, 1, 1.25, 1.5, 2].includes(incoming.size) ? incoming.size : 1, text };
      pages.receive({ enabled: state.enabled, text, cueId: Number.isSafeInteger(incoming.cueId) ? incoming.cueId : 0,
        wordOffset: Number.isSafeInteger(incoming.wordOffset) && incoming.wordOffset >= 0 ? incoming.wordOffset : 0,
        clearReason: incoming.clearReason });
      ensureOverlay();
      if (line) { line.textContent = state.text; line.style.color = state.color === 'yellow' ? '#ffeb3b' : '#ffffff'; }
      place();
    });
    document.addEventListener('DOMContentLoaded', ensureOverlay);
    bufferedCaptions = installCaptionBuffer({ipcRenderer,document,window,cache:new CaptionCache(),onChange:() => {ensureOverlay();place();}});
    document.addEventListener('fullscreenchange', place);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    // Track the live site's video layout without reading or changing its app state.
    setInterval(place, 100);
  }
  installControls({model: ControlsModel, ipcRenderer, document, window,
    onChannelChange: () => bufferedCaptions?.channelChanged(),
    navigator: typeof navigator === 'object' ? navigator : {}, platform: process.platform || 'win32'});
}
