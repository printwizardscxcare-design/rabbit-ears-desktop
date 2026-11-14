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
 let policy={enabled:true,color:'white'},applied='',candidate='',since=0,last='';
 function tick(){
  const video=document.querySelector('#vid');
  const key=(video?.currentSrc||'')+'|'+policy.enabled+'|'+policy.color+'|'+(video?.dataset.captionAvailability||'');
  if(video&&(key!==applied||!policy.enabled&&video.dataset.captionColor!=='none')){
   const value=policy.enabled?(video.dataset.captionColor==='none'?policy.color:video.dataset.captionColor||policy.color):'none';
   const choice=document.querySelector('[data-caption-choice="'+value+'"]');
   if(choice){choice.click();applied=key;}
  }
  const status=document.body?.dataset?.mode&&document.body.dataset.mode!=='tv'?'pending':captionAvailability(video),signature=(video?.currentSrc||'')+'|'+status;
  if(signature!==candidate){candidate=signature;since=now();}
  // Stop a running recognizer immediately when a source changes or a track arrives.
  // Only absence needs a settling period; loading/hidden tracks are not missing tracks.
  const settled=status==='none'&&now()-since<1500?'pending':status;
  const report=(video?.currentSrc||'')+'|'+settled;
  if(report!==last){last=report;ipcRenderer.send('captions:availability',{status:settled});}
 }
 ipcRenderer.on('desktop:caption-policy',(_event,value)=>{policy={enabled:value?.enabled!==false,color:value?.color==='yellow'?'yellow':'white'};applied='';tick();});
 const timer=window.setInterval(tick,250);window.addEventListener('beforeunload',()=>window.clearInterval(timer),{once:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
 return {tick};
}
module.exports={captionAvailability,installStreamCaptions};
