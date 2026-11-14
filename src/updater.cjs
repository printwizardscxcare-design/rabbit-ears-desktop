'use strict';
function createUpdater({app,win,dialog,autoUpdater,platform=process.platform}){
 const supported=app.isPackaged&&platform==='win32';let busy=false,downloaded=false,manual=false,timer;
 autoUpdater.autoDownload=false;autoUpdater.autoInstallOnAppQuit=false;
 autoUpdater.allowDowngrade=false;autoUpdater.allowPrerelease=/-beta\./.test(app.getVersion());
 const show=options=>dialog.showMessageBox(win,{type:'info',buttons:['OK'],...options});
 autoUpdater.on('error',()=>{}); // Check/download promises own error reporting; quiet startup checks stay quiet.
 autoUpdater.on('update-downloaded',async info=>{
  downloaded=true;
  const choice=await show({message:'Rabbit Ears '+info.version+' is ready.',detail:'Restart the app to install the update. Your saved settings stay in place.',buttons:['Restart and install','Later'],defaultId:1,cancelId:1});
  if(choice.response===0)autoUpdater.quitAndInstall(false,true);
 });
 async function check(quiet=false){
  if(!supported){if(!quiet)await show({message:'In-app updates are available in the installed Windows app.',detail:'Use the latest installer from the Rabbit Ears Desktop GitHub releases page for development or other platforms.'});return;}
  if(busy)return;if(downloaded){autoUpdater.quitAndInstall(false,true);return;}
  busy=true;manual=!quiet;
  try{
   const result=await autoUpdater.checkForUpdates();
   if(!result?.isUpdateAvailable){if(manual)await show({message:'Rabbit Ears is up to date.'});return;}
   const choice=await show({message:'Rabbit Ears '+result.updateInfo.version+' is available.',detail:'Download this update now? It will only install when you choose to restart.',buttons:['Download update','Later'],defaultId:1,cancelId:1});
   if(choice.response===0)await autoUpdater.downloadUpdate();
  }catch{if(manual)await show({type:'warning',message:'Could not check or download updates.',detail:'Your current app still works. Check your connection and try again later.'});}
  finally{busy=false;manual=false;}
 }
 if(supported){timer=setTimeout(()=>check(true),20000);timer.unref?.();}
 win.once('closed',()=>clearTimeout(timer));
 return {check};
}
module.exports={createUpdater};
