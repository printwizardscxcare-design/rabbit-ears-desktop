'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const install = require('../src/caption-buffer-renderer.cjs');
const {CaptionCache} = require('../src/caption-cache.cjs');
function setup({siteControls = false} = {}) {
  const handlers = new Map(),events = new Map(),sent = [];
  let tick, clock = 0, tuning = false;
  const windowEvents = new Map();
  const video = {currentTime:100,currentSrc:'https://archive.org/download/test/test.mp4',readyState:4,paused:false,seekable:{length:1,start:()=>0},
    pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}};
  const ipcRenderer = {on:(key,callback)=>handlers.set(key,callback),send:(...args)=>sent.push(args)};
  let sitePaused = false,pauseClicks = 0;
  const pauseButton = {getAttribute:()=>sitePaused ? 'Play (Space)' : 'Pause (Space)',click(){
    sitePaused=!sitePaused;pauseClicks++;
    if (sitePaused) video.pause();
    else {video.currentTime+=1.8;video.play();queueMicrotask(()=>{events.get('seeking')?.({target:video});events.get('seeked')?.({target:video});});}
  }};
  const rewindButton = {click(){video.currentTime-=15;queueMicrotask(()=>events.get('seeked')?.({target:video}));}};
  const document = {querySelector:selector=>selector === '.tuning-slate' ? tuning ? {getClientRects:()=>[{}]} : null : siteControls && selector === '#pause' ? pauseButton : siteControls && selector === '#back' ? rewindButton : video,
    addEventListener:(key,callback)=>events.set(key,callback)};
  const window = {location:{pathname:'/first-channel'},setInterval:callback=>{tick=callback;return 1;},clearInterval(){},addEventListener:(key,callback)=>windowEvents.set(key,callback)};
  const renderer = install({ipcRenderer,document,window,cache:new CaptionCache(),onChange(){},now:()=>clock});
  return {video,sent,renderer,tuning:value=>{tuning=value;},route:pathname=>{window.location.pathname=pathname;windowEvents.get('rabbit-ears:navigate')();},userToggle:()=>pauseButton.click(),pauseClicks:()=>pauseClicks,tick:(elapsed=0)=>{clock+=elapsed;tick();},event:key=>events.get(key)?.({target:video}),send:(key,value)=>handlers.get(key)({},value),
    source:()=>sent.filter(([key])=>key==='buffer:source').at(-1)[1],render:()=>renderer.render(50,s=>s.length)?.text};
}

test('caption preparation never seeks, pauses, or resumes the live stream',()=>{
 const h=setup();h.send('desktop:caption-buffer',{enabled:true,active:true,cooldownSeconds:0,rewind:true});
 assert.equal(h.source().startMs,100000);assert.equal(h.video.currentTime,100);assert.equal(h.video.paused,false);
 const old=h.source();h.send('desktop:buffer-ready',{session:old.session,untilMs:120000});
 h.send('desktop:buffer-cue',{session:old.session,startMs:100000,endMs:102000,text:'Live speech'});assert.equal(h.render(),'Live speech');
 h.video.currentTime=119;h.tick();assert.equal(h.video.paused,false);assert.equal(h.video.currentTime,119);
 h.send('desktop:caption-buffer',{enabled:false,active:false});assert.equal(h.video.paused,false);assert.equal(h.video.currentTime,119);
});
test('an already paused stream remains paused through recognition and disable',()=>{
 const h=setup();h.video.paused=true;h.send('desktop:caption-buffer',{enabled:true,active:true,cooldownSeconds:0});const source=h.source();
 h.send('desktop:buffer-ready',{session:source.session,untilMs:125000});assert.equal(h.video.paused,true);
 h.send('desktop:caption-buffer',{enabled:false,active:false});assert.equal(h.video.paused,true);
});
test('channel changes replace only the caption source and reject late cues',()=>{
 const h=setup();h.send('desktop:caption-buffer',{enabled:true,active:true,cooldownSeconds:0});const old=h.source();
 h.video.currentSrc='https://archive.org/download/new/new.mp4';h.video.currentTime=40;h.renderer.channelChanged();h.tick();
 const next=h.source();assert.notEqual(next.session,old.session);assert.equal(next.startMs,40000);assert.equal(h.video.currentTime,40);assert.equal(h.video.paused,false);
 h.send('desktop:buffer-cue',{session:old.session,startMs:40000,endMs:45000,text:'Stale'});h.send('desktop:buffer-ready',{session:next.session,untilMs:65000});assert.equal(h.render(),'');
});
test('seeking replaces the subtitle cache without changing the requested time',()=>{
 const h=setup();h.send('desktop:caption-buffer',{enabled:true,active:true,cooldownSeconds:0});const old=h.source();h.video.currentTime=60;h.event('seeking');h.event('seeked');
 assert.notEqual(h.source().session,old.session);assert.equal(h.source().startMs,60000);assert.equal(h.video.currentTime,60);assert.equal(h.video.paused,false);
});
test('temporary recognition failures retry without interrupting playback',()=>{
 const h=setup();h.send('desktop:caption-buffer',{enabled:true,active:true,cooldownSeconds:0});const old=h.source();h.send('desktop:buffer-failure',{});
 assert.equal(h.video.paused,false);h.tick(5001);assert.notEqual(h.source().session,old.session);assert.equal(h.video.currentTime,100);
});
