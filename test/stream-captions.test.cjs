const {test}=require('node:test'),assert=require('node:assert/strict');
const {captionAvailability,installStreamCaptions}=require('../src/stream-captions.cjs');
const video=(state,tracks=[])=>({currentSrc:'https://archive.org/download/a/a.mp4',dataset:{captionAvailability:state,captionColor:'none'},querySelectorAll:()=>tracks,textTracks:[]});
test('stream tracks, loading tracks and burned-in text suppress recognition; failures permit it',()=>{
 assert.equal(captionAvailability(video('burned-in')),'burned-in');
 assert.equal(captionAvailability(video('provided',[{readyState:2}])),'provided');
 assert.equal(captionAvailability(video('provided',[{readyState:1}])),'pending');
 assert.equal(captionAvailability(video('provided',[{readyState:3}])),'none');
 assert.equal(captionAvailability(video('none')),'none');assert.equal(captionAvailability(null),'pending');
});
test('availability settles, updates source changes immediately, and enables stream subtitles without seeking',()=>{
 let v=video('none'),clock=0;const events=new Map(),sent=[],choices=[];
 const instance=installStreamCaptions({ipcRenderer:{on:(n,f)=>events.set(n,f),send:(...x)=>sent.push(x)},document:{readyState:'complete',querySelector:s=>s==='#vid'?v:{click:()=>choices.push(s)}},window:{setInterval:()=>1,clearInterval(){},addEventListener(){}},now:()=>clock});
 assert.equal(sent.at(-1)[1].status,'pending');clock=1600;instance.tick();assert.equal(sent.at(-1)[1].status,'none');
 v=video('provided',[{readyState:2}]);v.currentSrc+='?new';instance.tick();assert.equal(sent.at(-1)[1].status,'provided');
 events.get('desktop:caption-policy')({}, {enabled:false});assert.equal(choices.length,0);
 events.get('desktop:caption-policy')({}, {enabled:true,color:'yellow'});assert.equal(choices.length,0);assert.ok(sent.some(([event])=>event==='captions:render-policy'));
});

test('text tracks in the browser are recognized even without a site marker',()=>{const v=video('none');v.textTracks=[{kind:'captions',cues:[{}]}];assert.equal(captionAvailability(v),'provided');});
