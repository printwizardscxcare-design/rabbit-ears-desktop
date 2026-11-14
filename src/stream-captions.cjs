'use strict';
function captionAvailability(video){
 if(!video?.currentSrc)return 'pending';
 const state=video.dataset?.captionAvailability;
 if(state==='burned-in')return state;
 const tracks=Array.from(video.querySelectorAll('track[kind="captions"],track[kind="subtitles"]'));
 if(tracks.some(t=>t.readyState===2))return 'provided';
 if(tracks.some(t=>t.readyState===0||t.readyState===1))return 'pending';
 if(tracks.length&&tracks.every(t=>t.readyState===3))return 'none';
 if(state==='provided')return 'provided';
 const native=Array.from(video.textTracks||[]).some(t=>['captions','subtitles'].includes(t.kind)&&t.cues?.length);
 return native?'provided':state==='none'?'none':'pending';
}
function installStreamCaptions({ipcRenderer,document,window,now=()=>Date.now()}){
 let policy={enabled:true,color:'white',size:1},applied='',candidate='',since=0,last='';
 function tick(){
  const video=document.querySelector('#vid');
  if(document.documentElement?.style){
   let style=document.getElementById('rabbit-desktop-stream-caption-style');
   if(!style){style=document.createElement('style');style.id='rabbit-desktop-stream-caption-style';
    style.textContent='#screen .caption-layer{font-size:var(--rabbit-desktop-caption-font)!important;color:var(--rabbit-desktop-caption-color)!important;visibility:var(--rabbit-desktop-caption-visibility,visible)!important}#screen .caption-layer .caption-text{font-size:inherit!important;color:inherit!important}#vid::cue{font-family:"Segoe UI",sans-serif!important;font-size:var(--rabbit-desktop-caption-font)!important;color:var(--rabbit-desktop-caption-color)!important}';
    document.documentElement.appendChild(style);
   }
   const rectangle=video?.getBoundingClientRect(),fullscreen=!!document.fullscreenElement;
   const width=fullscreen?window.innerWidth:rectangle?.width||900;
   const fontSize=(fullscreen?Math.max(24,Math.min(80,window.innerHeight*.04)):Math.max(20,Math.min(42,width*.026)))*policy.size;
   document.documentElement.style.setProperty('--rabbit-desktop-caption-font',fontSize+'px');
   document.documentElement.style.setProperty('--rabbit-desktop-caption-color',policy.color==='yellow'?'#ffeb3b':'#ffffff');
   document.documentElement.style.setProperty('--rabbit-desktop-caption-visibility',policy.enabled?'visible':'hidden');
  }
  const key=(video?.currentSrc||'')+'|'+policy.enabled+'|'+policy.color+'|'+policy.size+'|'+(video?.dataset.captionAvailability||'');
  if(video&&key!==applied){ipcRenderer.send('captions:render-policy');applied=key;}
  const status=document.body?.dataset?.mode&&document.body.dataset.mode!=='tv'?'pending':captionAvailability(video),signature=(video?.currentSrc||'')+'|'+status;
  if(signature!==candidate){candidate=signature;since=now();}
  // Stop a running recognizer immediately when a source changes or a track arrives.
  // Only absence needs a settling period; loading/hidden tracks are not missing tracks.
  const settled=status==='none'&&now()-since<1500?'pending':status;
  const report=(video?.currentSrc||'')+'|'+settled;
  if(report!==last){last=report;ipcRenderer.send('captions:availability',{status:settled});}
 }
 ipcRenderer.on('desktop:caption-policy',(_event,value)=>{policy={enabled:value?.enabled!==false,color:value?.color==='yellow'?'yellow':'white',size:[.8,1,1.25,1.5,2].includes(value?.size)?value.size:1};applied='';tick();});
 document.addEventListener?.('click',event=>{
  if(!event.isTrusted)return;
  const value=event.target.closest?.('[data-caption-choice]')?.dataset.captionChoice;
  if(['none','white','yellow'].includes(value)){event.preventDefault();event.stopImmediatePropagation();ipcRenderer.send('captions:appearance',{enabled:value!=='none',...(value==='none'?{}:{color:value})});}
 },true);
 window.addEventListener('resize',tick);document.addEventListener?.('fullscreenchange',tick);
 const timer=window.setInterval(tick,250);window.addEventListener('beforeunload',()=>window.clearInterval(timer),{once:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
 return {tick};
}
module.exports={captionAvailability,installStreamCaptions};
