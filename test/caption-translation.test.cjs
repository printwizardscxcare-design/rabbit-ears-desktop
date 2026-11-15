const {test}=require('node:test'),assert=require('node:assert/strict'),{EventEmitter}=require('node:events'),{PassThrough,Writable}=require('node:stream');
const {CaptionTranslator}=require('../src/caption-translation.cjs');
test('local translation caches results and cancellation rejects stale channel requests',async()=>{
 let child,request,launches=0;
 const translator=new CaptionTranslator({nativeRoot:'/native',platform:'linux',launch:(file,args,options)=>{
  launches++;assert.equal(options.windowsHide,true);assert.ok(file.endsWith('caption-translate'));assert.ok(args.includes('--model'));
  child=Object.assign(new EventEmitter(),{stdout:new PassThrough(),stderr:new PassThrough(),stdin:new Writable({write(bytes,_encoding,done){request=JSON.parse(bytes);done();}}),kill(){}});return child;
 }});
 const pending=translator.translate('Hello','es');child.stdout.write(JSON.stringify({id:request.id,text:'Hola'})+'\n');assert.equal(await pending,'Hola');
 assert.equal(await translator.translate('Hello','es'),'Hola');assert.equal(launches,1);
 const stale=translator.translate('Goodbye','fr');translator.stop();await assert.rejects(stale,/interrupted/);
 const fresh=translator.translate('Welcome','ar');child.stdout.write(JSON.stringify({id:request.id,text:'مرحبا'})+'\n');assert.equal(await fresh,'مرحبا');translator.stop();
 await assert.rejects(translator.translate('Hello','unknown'),/Invalid/);
});
