'use strict';
const {app}=require('electron'),{NsisUpdater}=require('electron-updater'),{ElectronHttpExecutor}=require('electron-updater/out/electronHttpExecutor'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),pkg=require('../package.json');
const profile=path.join(__dirname,'../dist/update-feed-check');fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);
const timeout=setTimeout(()=>{console.error('Update feed check timed out');app.exit(1);},45000);
app.whenReady().then(async()=>{try{
 const updater=new NsisUpdater(null,{version:pkg.version,name:pkg.name,isPackaged:true,appUpdateConfigPath:path.join(__dirname,'../dist/win-unpacked/resources/app-update.yml'),userDataPath:profile,baseCachePath:profile,whenReady:()=>app.whenReady(),relaunch:()=>{},quit:()=>{},onQuit:()=>{}});
 updater.httpExecutor=new ElectronHttpExecutor(()=>{});updater.autoDownload=false;updater.allowPrerelease=true;updater.allowDowngrade=false;
 const result=await updater.checkForUpdates();assert.equal(result.updateInfo.version,pkg.version);assert.equal(result.isUpdateAvailable,false);
 console.log('PASS: published GitHub beta feed resolves the running version with no download or downgrade.');clearTimeout(timeout);app.exit(0);
 }catch(e){console.error(e);clearTimeout(timeout);app.exit(1);}});
