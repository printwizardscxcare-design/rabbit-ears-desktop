'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),work=path.join(root,'native/bin/translation-build'),output=path.join(root,'native/bin/whisper/translation');
fs.mkdirSync(work,{recursive:true});fs.mkdirSync(output,{recursive:true});
const python=process.platform==='win32'?'py':'python3',prefix=process.platform==='win32'?['-3.12']:[];
const run=(exe,args)=>execFileSync(exe,args,{cwd:root,stdio:'inherit',windowsHide:true});
const venv=path.join(work,'venv'),runtime=path.join(venv,process.platform==='win32'?'Scripts/python.exe':'bin/python');
if(!fs.existsSync(runtime))run(python,[...prefix,'-m','venv',venv]);
run(runtime,['-m','pip','install','setuptools==80.9.0','ctranslate2==4.6.0','sentencepiece==0.2.0','pyinstaller==6.14.2']);
const model=path.join(output,'model');
if(!fs.existsSync(path.join(model,'model.bin'))){
 run(runtime,['-m','pip','install','transformers==4.51.3']);
 run(runtime,['-m','pip','install','torch==2.7.1',...(process.platform==='darwin'?[]:['--index-url','https://download.pytorch.org/whl/cpu'])]);
 run(runtime,['native/translation/prepare.py',model]);
 // Conversion tools are not bundled with the caption helper.
 run(runtime,['-m','pip','uninstall','-y','torch','transformers','tokenizers']);
}
run(runtime,['-m','PyInstaller','--noconfirm','--clean','--onedir','--name','caption-translate','--distpath',output,'--workpath',path.join(work,'pyinstaller'),'--specpath',work,'--hidden-import','pkg_resources','--collect-all','ctranslate2','native/translation/helper.py']);
fs.copyFileSync(path.join(root,'native/translation/NOTICES.md'),path.join(output,'NOTICES.md'));
console.log('Built local caption translation helper and bundled ten-language model.');
