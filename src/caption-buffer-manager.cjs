'use strict';
const path = require('node:path');
const {CaptionReadAhead} = require('./caption-read-ahead.cjs');
const {isSite} = require('./policy.cjs');

function createCaptionBufferManager({win,ipcMain,nativeRoot,platform,translate=async text=>text,onStatus = () => {},onFailure = () => {},onCooldown = () => {},Reader = CaptionReadAhead}) {
  const playerContents = win.webContents;
  const reader = new Reader({ffmpeg:path.join(nativeRoot,'whisper',platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    helper:path.join(nativeRoot,'whisper',platform === 'win32' ? 'caption-reader.exe' : 'caption-reader')});
  let config = {enabled:false,active:false,speed:'fast',delayMs:0,cooldownSeconds:5};
  let generation=0;
  const valid = event => event.sender === win.webContents && event.senderFrame === win.webContents.mainFrame && isSite(event.senderFrame?.url);
  const send = (name,value) => {if (!win.isDestroyed() && isSite(win.webContents.getURL())) win.webContents.send(name,value);};
  const failure = message => {if (!config.enabled) return;send('desktop:buffer-failure',{});onFailure(message);};
  reader.on('failure',failure);
  for (const name of ['cue','progress','ready','complete']) reader.on(name,value => {
    if (!config.enabled) return;
    if(name==='cue'&&config.language&&config.language!=='en'){
      const request=generation,language=config.language;
      translate(value.text,language).then(text=>{if(config.enabled&&request===generation)send('desktop:buffer-cue',{...value,text});}).catch(()=>{if(request===generation)onStatus('Translation is catching up; playback continues');});return;
    }
    send(`desktop:buffer-${name}`,value);
    if (name === 'ready') onStatus('Subtitles buffered 15 seconds ahead');
  });
  const source = (event,value) => {
    if (!valid(event) || !config.enabled) return;
    try {++generation;reader.start(value,config.speed,config.cleanup === true);onStatus('Preparing subtitle buffer…');}
    catch (error) {failure(error.message);}
  };
  const clock = (event,value) => {if (valid(event) && config.enabled) reader.clock(value?.session,value?.timeMs);};
  const stop = event => {if (valid(event)){++generation;reader.stop();}};
  const cooldown = (event,waiting) => {
    if (!valid(event) || typeof waiting !== 'boolean' || !(config.active || config.enabled)) return;
    if (waiting) reader.stop();
    onCooldown(waiting);
  };
  const replay = () => {
    // A reloaded page has no running countdown from the previous renderer.
    onCooldown(false);send('desktop:caption-buffer',{...config,rewind:false,restart:false});
  };
  ipcMain.on('buffer:source',source);ipcMain.on('buffer:clock',clock);ipcMain.on('buffer:stop',stop);
  ipcMain.on('buffer:cooldown',cooldown);
  win.webContents.on('did-finish-load',replay);
  const destroy = () => {
    config = {...config,enabled:false};
    ++generation;
    reader.stop();ipcMain.removeListener('buffer:source',source);ipcMain.removeListener('buffer:clock',clock);ipcMain.removeListener('buffer:stop',stop);
    ipcMain.removeListener('buffer:cooldown',cooldown);
    playerContents.removeListener('did-finish-load',replay);
  };
  win.once('closed',destroy);
  return {set(value) {config = {...config,...value};if (!config.enabled || value.restart){++generation;reader.stop();}send('desktop:caption-buffer',config);},destroy};
}
module.exports = {createCaptionBufferManager};
