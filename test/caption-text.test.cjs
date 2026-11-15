const {test}=require('node:test');
const assert=require('node:assert/strict');
const {plainText,nativeText}=require('../src/caption-text.cjs');
const {CaptionPages}=require('../src/caption-pages.cjs');
const {CaptionCache}=require('../src/caption-cache.cjs');

test('caption formatting is readable text, including escaped provider tags',()=>{
 for(const input of ['<i>- Cerritos,</i> come in.','&lt;i&gt;- Cerritos,&lt;/i&gt; come in.',
  '&amp;lt;i&amp;gt;- Cerritos,&amp;lt;/i&amp;gt; come in.','&#60;i&#62;- Cerritos,&#60;/i&#62; come in.']){
  assert.equal(plainText(input),'- Cerritos, come in.');
  assert.equal(nativeText(input),'<i>- Cerritos,</i> come in.');
 }
 assert.equal(plainText('<v Doctor><c.yellow><b>Hello</b></c></v><br>Second <u>line</u>.'),'Hello\nSecond line.');
 assert.equal(plainText('<font color="yellow">Words</font><00:00:02.000> follow'),'Words follow');
});

test('dialogue, comparisons and Unicode survive without interpreting unknown HTML',()=>{
 assert.equal(plainText('2 &lt; 3 &amp; 5 &gt; 4 — café &#x1F430;'),'2 < 3 & 5 > 4 — café 🐰');
 assert.equal(plainText('Call <name> &unknown;'),'Call <name> &unknown;');
 assert.equal(nativeText('<img src=x onerror=alert(1)>'),'&lt;img src=x onerror=alert(1)&gt;');
 assert.equal(nativeText('<i onclick="alert(1)">Words</i>'),'<i>Words</i>');
 assert.equal(plainText('&#0; &#xD800; &#x110000;'),'&#0; &#xD800; &#x110000;');
});

test('recognition and read-ahead cards measure cleaned text without changing cue timing',()=>{
 const pages=new CaptionPages({now:()=>0});
 pages.receive({enabled:true,text:'&lt;i&gt;- Cerritos,&lt;/i&gt; come in.',cueId:1});
 assert.equal(pages.render(500,text=>text.length).text,'- Cerritos, come in.');
 const cache=new CaptionCache();cache.reset(9);
 cache.add({session:9,startMs:1000,endMs:5000,text:'<i>- Cerritos,</i> come in.'});
 assert.equal(cache.render(2000,500,text=>text.length).text,'- Cerritos, come in.');
 assert.equal(cache.render(5000,500,text=>text.length).text,'');
 assert.deepEqual([cache.cues[0].startMs,cache.cues[0].endMs],[1000,5000]);
});
