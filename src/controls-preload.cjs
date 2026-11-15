'use strict';
const {contextBridge, ipcRenderer} = require('electron');
if (location.protocol === 'file:' && location.pathname.endsWith('/controls.html')) {
  contextBridge.exposeInMainWorld('controlsSettings', {
    load: () => ipcRenderer.invoke('controls:load'),
    save: value => ipcRenderer.invoke('controls:save', value),
    close: () => ipcRenderer.send('controls:close'),
    onCatalog: callback => ipcRenderer.on('controls:catalog', (_event, value) => callback(value)),
    onLanguage:callback=>ipcRenderer.on('controls:language',(_event,value)=>callback(value)),
    onTheme: callback => ipcRenderer.on('controls:theme', (_event, value) => callback(value))
  });
}
