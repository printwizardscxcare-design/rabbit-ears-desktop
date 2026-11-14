'use strict';
const {isSite,isTrustedNavigation}=require('./policy.cjs');
function createWindowMode({win,ipcMain,screen,Menu,errorPage,allowOnTop=true}){
 const contents=win.webContents;let compact=false,original=null,smallBounds=null;
 const valid=event=>event.sender===contents&&event.senderFrame===contents.mainFrame&&(isTrustedNavigation(event.senderFrame?.url)||event.senderFrame?.url===errorPage);
 const menuItems=()=>Menu?.getApplicationMenu()?.items||[];
 const notify=()=>{if(!win.isDestroyed())contents.send('desktop:window-state',{compact,maximized:win.isMaximized?.()||false,menus:menuItems().flatMap((item,index)=>item.visible!==false&&item.submenu?[{index,label:item.label,enabled:item.enabled!==false}]:[])});};
 // Frameless Windows/Linux windows cannot display Electron's native menu bar.
 // Local chrome exposes its headings; their dropdowns are the original live menus.
 const openMenu=(event,request)=>{
  if(!valid(event)||compact||win.isFullScreen()||!request||!Number.isInteger(request.index))return;
  const item=menuItems()[request.index];
  if(!item?.submenu||item.visible===false||item.enabled===false||!Number.isFinite(request.x)||!Number.isFinite(request.y))return;
  const zoom=contents.getZoomFactor?.()||1,bounds=win.getContentBounds?.()||win.getBounds();
  item.submenu.popup({window:win,x:Math.max(0,Math.min(bounds.width,Math.round(request.x*zoom))),y:Math.max(0,Math.min(bounds.height,Math.round(request.y*zoom)))});
 };
 function toggle(){
  if(!compact){
   if(!isSite(contents.getURL()))return;
   original={...win.getNormalBounds(),maximized:win.isMaximized(),alwaysOnTop:win.isAlwaysOnTop(),menuVisible:win.isMenuBarVisible?.()??true};
   if(win.isFullScreen())win.setFullScreen(false);
   if(win.isMaximized())win.unmaximize();
   compact=true;win.setMinimumSize(360,320);win.setMenuBarVisibility?.(false);if(allowOnTop)win.setAlwaysOnTop(true);
   const area=screen.getDisplayMatching(win.getBounds()).workArea;
   const desired=smallBounds||{...original,width:640,height:440};const width=Math.min(desired.width,area.width),height=Math.min(desired.height,area.height);
   win.setBounds({x:Math.max(area.x,Math.min(desired.x,area.x+area.width-width)),y:Math.max(area.y,Math.min(desired.y,area.y+area.height-height)),width,height});
  }else{
   smallBounds=win.getNormalBounds();if(win.isFullScreen())win.setFullScreen(false);if(win.isMaximized())win.unmaximize();compact=false;
   win.setMinimumSize(640,480);win.setAlwaysOnTop(original.alwaysOnTop);win.setMenuBarVisibility?.(original.menuVisible);
   win.setBounds({x:original.x,y:original.y,width:original.width,height:original.height});if(original.maximized)win.maximize();
  }
  notify();
 }
 const action=(event,name)=>{if(!valid(event))return;switch(name){case 'compact':toggle();break;case 'minimize':win.minimize();break;case 'maximize':win.isMaximized()?win.unmaximize():win.maximize();notify();break;case 'close':win.close();break;}};
 const ready=event=>{if(valid(event))notify();};
 const navigation=(_event,url,inPlace,isMainFrame)=>{if(isMainFrame&&!inPlace&&!isSite(url)&&compact)toggle();};
 ipcMain.on('desktop:window-action',action);ipcMain.on('desktop:window-ready',ready);ipcMain.on('desktop:menu-open',openMenu);contents.on('did-finish-load',notify);contents.on('did-start-navigation',navigation);win.on('maximize',notify);win.on('unmaximize',notify);
 win.once('closed',()=>{ipcMain.removeListener('desktop:window-action',action);ipcMain.removeListener('desktop:window-ready',ready);ipcMain.removeListener('desktop:menu-open',openMenu);contents.removeListener('did-finish-load',notify);contents.removeListener('did-start-navigation',navigation);});
 return {toggle,get compact(){return compact;},savedState(){return compact?{x:original.x,y:original.y,width:original.width,height:original.height,maximized:original.maximized}:{...win.getNormalBounds(),maximized:win.isMaximized()};}};
}
module.exports={createWindowMode};
