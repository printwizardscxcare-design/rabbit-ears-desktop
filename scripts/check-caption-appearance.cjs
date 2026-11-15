'use strict';
const {app,BrowserWindow,Menu,session}=require('electron'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),profile=path.join(process.env.RABBIT_EARS_UI_CHECK_ROOT||path.join(root,'dist'),'caption-appearance-profile-'+Date.now());fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);
const movie=path.join(profile,'test.mp4');execFileSync(path.join(root,'native/bin/whisper',process.platform==='win32'?'ffmpeg.exe':'ffmpeg'),['-nostdin','-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=black:s=640x360:r=10','-t','2','-c:v','libx264','-pix_fmt','yuv420p','-an','-movflags','+faststart',movie],{windowsHide:true});
let player;app.on('browser-window-created',(_e,w)=>{if(!player){player=w;w.on('ready-to-show',()=>w.hide());}});
const html=`<!doctype html><html><head><style>body{margin:0}.cabinet{display:grid;grid-template-columns:minmax(0,1fr) 45px;padding:12px;border:5px solid #765038;background:#684a31}.screen{border:6px solid #888;border-radius:12px}.hardware-panel{background:#765038}#screen{position:relative;width:800px;height:450px}#vid{width:100%;height:100%}.caption-layer{position:absolute;bottom:30px;width:100%;text-align:center;color:white}.caption-text{color:inherit}#screen:fullscreen{width:100vw;height:100vh}</style></head><body data-mode="tv"><div class="wrap"><header id="fixture-header">Full app header</header><section id="tvView"><div class="tv-hero"><div class="landing-copy">Programme details</div><div class="player-pack"><div class="cabinet"><div id="screen" class="screen"><video id="vid" data-caption-availability="provided" data-caption-color="white" muted autoplay loop src="/assets/test.mp4"><track kind="captions" label="English" src="/test.vtt" default></video><div class="caption-layer" style="font-size:27px"><span class="caption-text">Supplied subtitle appearance</span></div></div><aside class="hardware-panel">TV bezel</aside></div><div class="remote tv-transport"><button id="popoutTv" class="btn">Pop out</button><button id="pause" class="btn">Pause</button><button id="full" class="btn">Fullscreen</button></div><section class="now">Details</section></div><aside class="channel-rail">Stations</aside></div></section><div id="choices"><button data-caption-choice="none">Off</button><button data-caption-choice="white">White</button><button data-caption-choice="yellow">Yellow</button></div><footer>App footer</footer></div><script>window.popupCalls=0;document.getElementById("popoutTv").onclick=()=>{window.popupCalls++;window.open("about:blank");};window.sitePreferenceWrites=0;window.captionUI={applyPreferences:p=>{vid.dataset.captionColor=p.re_caption_style;document.querySelector(".caption-layer").dataset.color=p.re_caption_style;}};for(const b of document.querySelectorAll('[data-caption-choice]'))b.onclick=()=>{sitePreferenceWrites++;localStorage.setItem("site-caption-test",b.dataset.captionChoice);vid.dataset.captionColor=b.dataset.captionChoice;document.querySelector('.caption-layer').dataset.color=b.dataset.captionChoice;};document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.getElementById('screen').requestFullscreen();</script></body></html>`;
app.whenReady().then(()=>session.fromPartition('persist:rabbit-ears').protocol.handle('https',request=>{
 const u=new URL(request.url);if(u.pathname==='/assets/test.mp4'){const bytes=fs.readFileSync(movie);return new Response(bytes,{headers:{'Content-Type':'video/mp4'}});}
 if(u.pathname==='/test.vtt')return new Response('WEBVTT\n\n00:00:00.000 --> 00:01:00.000\nNative stream subtitle\n',{headers:{'Content-Type':'text/vtt'}});
 return new Response(html,{headers:{'Content-Type':'text/html'}});
}));
require('../src/main.cjs');
const wait=ms=>new Promise(r=>setTimeout(r,ms)),timeout=setTimeout(()=>{console.error('Caption appearance check timed out');app.exit(1);},60000);
async function until(check){for(let i=0;i<150;i++){if(await check())return;await wait(40);}throw Error('Caption appearance state did not settle');}
async function cancelSettings(window){
 // Let executeJavaScript return before Cancel tears down its renderer frame.
 assert.equal(await window.webContents.executeJavaScript('(()=>{const button=document.getElementById("cancel");if(!button)return false;setTimeout(()=>button.click(),25);return true;})()'),true);
 await until(()=>window.isDestroyed());
}
function find(node,id){if(node.attributes?.some((v,i)=>v==='id'&&node.attributes[i+1]===id))return node;for(const child of [...(node.children||[]),...(node.shadowRoots||[])]){const hit=find(child,id);if(hit)return hit;}}
function span(node){if(node.nodeName==='SPAN')return node;for(const child of [...(node.children||[]),...(node.shadowRoots||[])]){const hit=span(child);if(hit)return hit;}}
app.whenReady().then(async()=>{try{
 await until(async()=>player&&await player.webContents.executeJavaScript('Boolean(document.querySelector(".caption-layer")&&document.getElementById("rabbit-desktop-stream-caption-style"))').catch(()=>false));
 player.webContents.debugger.attach('1.3');await player.webContents.debugger.sendCommand('DOM.enable');await player.webContents.debugger.sendCommand('CSS.enable');
 const item=id=>Menu.getApplicationMenu().getMenuItemById(id);let comparisons=0;
 console.log('Checking visible normal-app menus and native dropdowns');
 await until(()=>player.webContents.executeJavaScript('document.querySelectorAll("#desktop-app-menu button").length>=7'));
 const headings=await player.webContents.executeJavaScript('[...document.querySelectorAll("#desktop-app-menu button")].map(b=>({text:b.textContent,visible:b.getBoundingClientRect().height>0}))');
 for(const label of ['Rabbit Ears','Navigate','View','Captions','Audio','Settings','Help'])assert.ok(headings.some(h=>h.text===label&&h.visible),label+' menu missing');
 const expectedMenus=Menu.getApplicationMenu().items.filter(i=>i.visible!==false&&i.submenu);
 for(const entry of expectedMenus){
  let opened=false;const submenu=entry.submenu,nativePopup=submenu.popup;
  submenu.popup=function(options){opened=true;assert.equal(options.window,player);return nativePopup.call(this,{...options,callback:()=>{}});};
  const pt=await player.webContents.executeJavaScript('(()=>{const b=[...document.querySelectorAll("#desktop-app-menu button")].find(b=>b.textContent==='+JSON.stringify(entry.label.replace(/&/g,''))+');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
  await player.webContents.debugger.sendCommand('Input.dispatchMouseEvent',{type:'mousePressed',...pt,button:'left',clickCount:1});await player.webContents.debugger.sendCommand('Input.dispatchMouseEvent',{type:'mouseReleased',...pt,button:'left',clickCount:1});
  await until(()=>opened);submenu.closePopup(player);submenu.popup=nativePopup;await wait(50);
 }
 console.log('Checking audio theme on open and live theme changes');
 item('audio-settings').click();
 const audio=BrowserWindow.getAllWindows().find(w=>w!==player);
 await until(()=>audio.webContents.executeJavaScript('document.querySelectorAll(".band input").length===10&&document.body.dataset.skin==="pixel"').catch(()=>false));
 const palette={pixel:['#1c293b','#32cec1'],retro:['#faf5e9','#a4462c'],theatre:['#251d29','#e2b967'],stadium:['#193427','#ffd36d'],modern:['#233140','#afd8fa'],cozy:['#48372d','#f7ca92'],metal:['#23262b','#ff7962'],ivory:['#fffaf2','#923b50'],gutter:['#232521','#d9fa32']};
 for(const [skin,colors] of Object.entries(palette)){
  await player.webContents.executeJavaScript('document.body.dataset.skin='+JSON.stringify(skin));
  await until(()=>audio.webContents.executeJavaScript('document.body.dataset.skin==='+JSON.stringify(skin)));
  const styled=await audio.webContents.executeJavaScript('(()=>{const s=getComputedStyle(document.body);return [s.getPropertyValue("--panel").trim(),s.getPropertyValue("--yellow").trim()]})()');assert.deepEqual(styled,colors);
 }
 assert.equal(fs.existsSync(path.join(profile,'audio.json')),false,'Theme changes must not write sound settings');audio.close();await wait(100);
 // Opening after the selection must also use the currently selected theme.
 item('audio-settings').click();const reopenedAudio=BrowserWindow.getAllWindows().find(w=>w!==player);
 await until(()=>reopenedAudio.webContents.executeJavaScript('document.body.dataset.skin==="gutter"').catch(()=>false));reopenedAudio.close();await wait(100);
 console.log('Checking Controls theme and unsaved bindings');
 item('controls-settings').click();let controls=BrowserWindow.getAllWindows().find(w=>w!==player);
 await until(()=>controls.webContents.executeJavaScript('document.body.dataset.skin==="gutter"&&document.querySelectorAll(".row").length>0').catch(()=>false));
 await controls.webContents.executeJavaScript('document.querySelector(".binding button").click()');
 const draft=await controls.webContents.executeJavaScript('document.getElementById("list").textContent');
 for(const [skin,colors] of Object.entries(palette)){
  await player.webContents.executeJavaScript('document.body.dataset.skin='+JSON.stringify(skin));
  await until(()=>controls.webContents.executeJavaScript('document.body.dataset.skin==='+JSON.stringify(skin)));
  const state=await controls.webContents.executeJavaScript('(()=>{const s=getComputedStyle(document.body);return {colors:[s.getPropertyValue("--panel").trim(),s.getPropertyValue("--yellow").trim()],draft:document.getElementById("list").textContent,dirty:!document.getElementById("save").disabled}})()');
  assert.deepEqual(state.colors,colors);assert.equal(state.draft,draft);assert.equal(state.dirty,true);
 }
 await cancelSettings(controls);assert.equal(fs.existsSync(path.join(profile,'controls.json')),false);
 item('controls-settings').click();controls=BrowserWindow.getAllWindows().find(w=>w!==player);await until(()=>controls.webContents.executeJavaScript('document.body.dataset.skin==="gutter"&&document.querySelectorAll(".row").length>0').catch(()=>false));assert.equal(await controls.webContents.executeJavaScript('document.getElementById("save").disabled'),true);controls.close();await wait(100);
 await player.webContents.executeJavaScript('document.body.dataset.skin="pixel"');
 console.log('Checking native menus and settings languages');
 item('controls-settings').click();controls=BrowserWindow.getAllWindows().find(w=>w!==player);await until(()=>controls.webContents.executeJavaScript('document.querySelectorAll(".row").length>0').catch(()=>false));
 await controls.webContents.executeJavaScript('document.querySelector(".binding button").click()');
 for(const language of ['es','fr','pt','zh','hi','ar','bn','id','ur']){
  console.log('Checking settings language '+language);
  await player.webContents.executeJavaScript('document.getElementById("vid").dataset.captionLanguage='+JSON.stringify(language));
  await until(()=>controls.webContents.executeJavaScript('document.documentElement.lang==='+JSON.stringify(language)));
  assert.notEqual(item('captions-off').label,'Off');assert.equal(await controls.webContents.executeJavaScript('document.getElementById("save").disabled'),false,'Language must preserve unsaved bindings');
  assert.equal(await controls.webContents.executeJavaScript('document.documentElement.dir'),['ar','ur'].includes(language)?'rtl':'ltr');
 }
 await cancelSettings(controls);assert.equal(fs.existsSync(path.join(profile,'controls.json')),false);
 item('audio-settings').click();const localizedAudio=BrowserWindow.getAllWindows().find(w=>w!==player);await until(()=>localizedAudio.webContents.executeJavaScript('document.documentElement.lang==="ur"').catch(()=>false));
 assert.equal(await localizedAudio.webContents.executeJavaScript('document.documentElement.dir'),'rtl');
 await player.webContents.executeJavaScript('document.getElementById("vid").dataset.captionLanguage="en"');await until(()=>localizedAudio.webContents.executeJavaScript('document.documentElement.lang==="en"'));localizedAudio.close();await wait(100);assert.equal(item('captions-off').label,'Off');
 console.log('Checking real caption styles');
 for(const full of [false,true]){
  console.log('Caption layout fullscreen='+full);
  if(full){await player.webContents.executeJavaScript('document.getElementById("screen").requestFullscreen()',true);await wait(100);}
  for(const size of [.8,1,1.25,1.5,2])for(const color of ['white','yellow']){
   item('caption-size-'+size).click();item('caption-color-'+color).click();await until(()=>player.webContents.executeJavaScript('getComputedStyle(document.querySelector(".caption-text")).color==='+JSON.stringify(color==='yellow'?'rgb(255, 235, 59)':'rgb(255, 255, 255)')));
   const supplied=await player.webContents.executeJavaScript('({font:getComputedStyle(document.querySelector(".caption-layer")).fontSize,color:getComputedStyle(document.querySelector(".caption-text")).color,source:document.getElementById("vid").currentSrc})');
   const expected=(full?Math.max(24,Math.min(80,(await player.webContents.executeJavaScript('innerHeight'))*.04)):20.8)*size;
   assert.ok(Math.abs(parseFloat(supplied.font)-expected)<.1,JSON.stringify({full,size,supplied,expected}));assert.equal(supplied.color,color==='yellow'?'rgb(255, 235, 59)':'rgb(255, 255, 255)');
   player.webContents.send('desktop:caption-buffer',{enabled:false,active:false});player.webContents.send('desktop:captions',{enabled:true,color,size,text:'&lt;i&gt;- Cerritos,&lt;/i&gt; come in.',cueId:++comparisons,wordOffset:0});await wait(50);
   await until(async()=>{try{const tree=await player.webContents.debugger.sendCommand('DOM.getDocument',{depth:-1,pierce:true}),host=find(tree.root,'rabbit-ears-desktop-caption-overlay'),text=host&&span(host);if(!text)return false;const result=await player.webContents.debugger.sendCommand('CSS.getComputedStyleForNode',{nodeId:text.nodeId}),css=Object.fromEntries(result.computedStyle.map(x=>[x.name,x.value]));return css.color===supplied.color&&Math.abs(parseFloat(css['font-size'])-parseFloat(supplied.font))<.1;}catch{return false;}});
   const tree=await player.webContents.debugger.sendCommand('DOM.getDocument',{depth:-1,pierce:true});const host=find(tree.root,'rabbit-ears-desktop-caption-overlay'),text=span(host);assert.ok(text);const markup=await player.webContents.debugger.sendCommand('DOM.getOuterHTML',{nodeId:text.nodeId});assert.equal(markup.outerHTML.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(),'- Cerritos, come in.','Engine caption formatting must never be printed');
   const computed=await player.webContents.debugger.sendCommand('CSS.getComputedStyleForNode',{nodeId:text.nodeId});const values=Object.fromEntries(computed.computedStyle.map(x=>[x.name,x.value]));assert.equal(values.color,supplied.color);assert.ok(Math.abs(parseFloat(values['font-size'])-parseFloat(supplied.font))<.1);
  }
  if(full){await player.webContents.executeJavaScript('document.exitFullscreen()');await until(()=>!player.isFullScreen());await wait(150);}
 }
 const point=await player.webContents.executeJavaScript('(()=>{const r=document.querySelector("[data-caption-choice=white]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');
 await player.webContents.debugger.sendCommand('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});await player.webContents.debugger.sendCommand('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});
 await until(()=>item('caption-color-white').checked===true);assert.equal(await player.webContents.executeJavaScript('getComputedStyle(document.querySelector(".caption-text")).color'),'rgb(255, 255, 255)');item('caption-color-yellow').click();await wait(80);
 await player.webContents.executeJavaScript('document.getElementById("vid").src="/assets/test.mp4?channel=two";document.querySelector(".caption-layer").style.fontSize="6px"');await wait(350);
 assert.equal(await player.webContents.executeJavaScript('getComputedStyle(document.querySelector(".caption-layer")).fontSize'),'41.6px');
 await player.webContents.executeJavaScript('document.querySelector(".caption-layer").style.fontSize="6px"');await wait(100);assert.notEqual(await player.webContents.executeJavaScript('getComputedStyle(document.querySelector(".caption-layer")).fontSize'),'6px');
 await player.webContents.reload();await until(async()=>await player.webContents.executeJavaScript('document.getElementById("vid")?.dataset.captionColor==="yellow"').catch(()=>false));
 const restored=await player.webContents.executeJavaScript('({font:getComputedStyle(document.querySelector(".caption-layer")).fontSize,color:getComputedStyle(document.querySelector(".caption-text")).color,node:typeof window.require})');assert.equal(restored.font,'41.6px');assert.equal(restored.color,'rgb(255, 235, 59)');assert.equal(restored.node,'undefined');
 console.log('Checking same-window compact mode');
 const originalBounds=player.getNormalBounds();const count=BrowserWindow.getAllWindows().length;
 await player.webContents.executeJavaScript('window.sameVideo=document.getElementById("vid");window.loadCalls=0;const nativeLoad=sameVideo.load.bind(sameVideo);sameVideo.load=(...args)=>{window.loadCalls++;return nativeLoad(...args);};sameVideo.pause();sameVideo.currentTime=.5;');await wait(150);
 const before=await player.webContents.executeJavaScript('({source:sameVideo.currentSrc,time:sameVideo.currentTime,paused:sameVideo.paused})');
 for(let n=0;n<2;n++){
  await player.webContents.executeJavaScript('document.getElementById("popoutTv").click()');await until(()=>player.webContents.executeJavaScript('document.body.classList.contains("desktop-compact")'));
  const compact=await player.webContents.executeJavaScript('({same:document.getElementById("vid")===sameVideo,source:sameVideo.currentSrc,time:sameVideo.currentTime,paused:sameVideo.paused,loads:loadCalls,popups:popupCalls,header:getComputedStyle(document.getElementById("fixture-header")).display,bar:getComputedStyle(document.getElementById("desktop-window-bar")).display,screen:document.getElementById("screen").getBoundingClientRect().height,caption:getComputedStyle(document.querySelector(".caption-text")).color})');
  assert.equal(compact.same,true);assert.equal(compact.source,before.source);assert.ok(Math.abs(compact.time-before.time)<.1);assert.equal(compact.paused,true);assert.equal(compact.loads,0);assert.equal(compact.popups,0);assert.equal(compact.header,'none');assert.equal(compact.bar,'none');assert.equal(await player.webContents.executeJavaScript('getComputedStyle(document.getElementById("desktop-app-menu")).display'),'none');assert.ok(compact.screen>200);const bezel=await player.webContents.executeJavaScript('(()=>{const c=document.querySelector(".cabinet"),r=c.getBoundingClientRect(),h=document.querySelector(".hardware-panel").getBoundingClientRect(),s=document.getElementById("screen").getBoundingClientRect(),remote=document.querySelector(".remote").getBoundingClientRect();return {border:getComputedStyle(c).borderTopWidth,display:getComputedStyle(c).display,hardware:h.width,inside:s.left>r.left&&s.right<r.right,stacked:remote.top>=r.bottom-1}})()');assert.equal(bezel.display,'grid');assert.equal(bezel.border,'5px');assert.ok(bezel.hardware>0&&bezel.inside&&bezel.stacked,JSON.stringify(bezel));assert.equal(compact.caption,'rgb(255, 235, 59)');assert.equal(BrowserWindow.getAllWindows().length,count);
  await player.webContents.executeJavaScript('document.getElementById("popoutTv").click()');await until(()=>player.webContents.executeJavaScript('!document.body.classList.contains("desktop-compact")'));
  assert.deepEqual(player.getNormalBounds(),originalBounds);assert.equal(await player.webContents.executeJavaScript('getComputedStyle(document.getElementById("desktop-app-menu")).display'),'flex');assert.equal(BrowserWindow.getAllWindows().length,count);
 }
 assert.equal(await player.webContents.executeJavaScript('window.sitePreferenceWrites'),0);assert.equal(await player.webContents.executeJavaScript('localStorage.getItem("site-caption-test")'),null);
 console.log('PASS: Controls follows all nine themes while preserving unsaved bindings and Cancel/reopen behavior. Audio follows all nine themes on open, while changing themes and after reopening without changing sound settings. Normal app menu headings open their native dropdowns, hide only in compact mode and return afterward. 20 real Chromium comparisons match stream and engine size/color; fullscreen, source changes, site controls and reload preserve preferences. Same-window compact/return preserves bounds, video, clock and pause state with the themed bezel and transport, without popup, reload or title bar.');clearTimeout(timeout);player.close();app.exit(0);
 }catch(e){console.error(e);clearTimeout(timeout);app.exit(1);}});
