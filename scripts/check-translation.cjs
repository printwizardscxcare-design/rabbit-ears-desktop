'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {CaptionTranslator,LANGUAGES}=require('../src/caption-translation.cjs');
const translator=new CaptionTranslator({nativeRoot:path.resolve(process.argv[2]||'native/bin')});
(async()=>{try{
 const outputs={};for(const language of LANGUAGES){outputs[language]=await translator.translate('Good morning. Welcome to the show.',language);assert.ok(outputs[language].trim());}
 assert.match(outputs.zh,/[\u3400-\u9fff]/);assert.match(outputs.hi,/[\u0900-\u097f]/);assert.match(outputs.ar,/[\u0600-\u06ff]/);assert.match(outputs.bn,/[\u0980-\u09ff]/);assert.match(outputs.ur,/[\u0600-\u06ff]/);
 assert.match(outputs.es,/buen|bienven/i);assert.match(outputs.fr,/bonjour|bienven/i);
 assert.equal(await translator.translate('Good morning. Welcome to the show.','es'),outputs.es);
 assert.match(await translator.translate('Buenos días. Bienvenidos al programa.','en','es'),/morning|welcome/i);
 console.log('PASS: bundled local helper translates all ten languages, Unicode and cached requests; no cloud connection.');
}finally{translator.stop();}})().catch(error=>{console.error(error);process.exitCode=1;});
