'use strict';
const {spawn}=require('node:child_process'),readline=require('node:readline'),path=require('node:path');
const LANGUAGES=['en','zh','hi','es','ar','fr','bn','pt','id','ur'];
class CaptionTranslator{
 constructor({nativeRoot,platform=process.platform,launch=spawn}){this.root=path.join(nativeRoot,'whisper/translation');this.platform=platform;this.launch=launch;this.pending=new Map();this.cache=new Map();this.serial=0;this.child=null;}
 start(){
  if(this.child)return;
  const folder=path.join(this.root,'caption-translate');
  const child=this.launch(path.join(folder,'caption-translate'+(this.platform==='win32'?'.exe':'')),['--model',path.join(this.root,'model')],{windowsHide:true,stdio:['pipe','pipe','pipe']});this.child=child;
  const lines=readline.createInterface({input:child.stdout});child.stderr.resume();child.stdin.on('error',()=>{});
  lines.on('line',line=>{try{const result=JSON.parse(line),pending=this.pending.get(result.id);if(!pending)return;clearTimeout(pending.timer);this.pending.delete(result.id);if(typeof result.text==='string'&&result.text.trim()&&result.text.length<24000){this.cache.set(pending.key,result.text);if(this.cache.size>256)this.cache.delete(this.cache.keys().next().value);pending.resolve(result.text);}else pending.reject(Error('Local caption translation unavailable'));}catch{}});
  child.once('error',()=>{if(this.child===child)this.stop();});child.once('close',()=>{lines.close();if(this.child===child)this.stop();});
 }
 translate(text,target,source='en'){
  if(!LANGUAGES.includes(source)||!LANGUAGES.includes(target)||typeof text!=='string'||text.length>6000)return Promise.reject(Error('Invalid caption translation'));
  if(source===target||!text.trim())return Promise.resolve(text);
  const key=source+'|'+target+'|'+text;if(this.cache.has(key))return Promise.resolve(this.cache.get(key));
  if(this.pending.size>=64)return Promise.reject(Error('Caption translation is catching up'));
  return new Promise((resolve,reject)=>{
   try{this.start();const id=++this.serial,timer=setTimeout(()=>this.stop(),45000);timer.unref?.();this.pending.set(id,{resolve,reject,timer,key});this.child.stdin.write(JSON.stringify({id,source,target,text})+'\n');}
   catch(error){reject(error);}
  });
 }
 stop(){const child=this.child;this.child=null;for(const pending of this.pending.values()){clearTimeout(pending.timer);pending.reject(Error('Caption translation interrupted'));}this.pending.clear();if(child)child.kill();}
}
module.exports={CaptionTranslator,LANGUAGES};
