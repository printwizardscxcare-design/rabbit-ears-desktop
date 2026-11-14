'use strict';
const {app,BrowserWindow,Menu}=require('electron'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const profile=path.join(__dirname,'../dist/desktop-check-profile');fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);
let player;const failures=[];app.on('browser-window-created',(_event,win)=>{if(!player){player=win;win.on('ready-to-show',()=>win.hide());win.webContents.on('console-message',event=>{if(/Unable to load preload|ReferenceError|TypeError/.test(event.message))failures.push(event.message);});}});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));const timeout=setTimeout(()=>{console.error('Desktop startup timed out');app.exit(1);},60000);
require('../src/main.cjs');
app.whenReady().then(async()=>{try{
 for(let i=0;i<100;i++){if(player&&await player.webContents.executeJavaScript('Boolean(document.getElementById("vid")&&window.REUI)').catch(()=>false))break;await wait(400);}
 assert.ok(player);const state=await player.webContents.executeJavaScript('({origin:location.origin,title:document.title,video:!!document.getElementById("vid"),node:typeof window.require,theme:document.body.dataset.skin})');assert.equal(state.origin,'https://rabbit-ears.stream');assert.equal(state.video,true);assert.equal(state.node,'undefined');assert.ok(state.theme);
 await player.webContents.executeJavaScript('window.REUI.openChannel(0)');await wait(2000);
 assert.ok(Menu.getApplicationMenu().getMenuItemById('caption-engine-whisper'));assert.equal(Menu.getApplicationMenu().getMenuItemById('captions-on').checked,true);
 assert.deepEqual(failures,[]);await player.webContents.capturePage().then(image=>fs.writeFileSync(path.join(__dirname,'../dist/desktop-first-launch.png'),image.toPNG()));
 console.log(JSON.stringify({passed:true,...state,captionStatus:Menu.getApplicationMenu().getMenuItemById('caption-status').label}));clearTimeout(timeout);player.close();app.exit(0);
 }catch(e){console.error(e);clearTimeout(timeout);app.exit(1);}});
