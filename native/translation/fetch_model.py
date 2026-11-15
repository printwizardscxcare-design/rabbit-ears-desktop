"""Build-time only: verified portable model, avoiding platform-specific conversion tools."""
from pathlib import Path
import hashlib
import shutil
import sys
import urllib.request
import zipfile

URL='https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.7/caption-translation-model-v1.zip'
SHA='9710da068e0e5c356cbb9fe625b57375cd4a9d5e68bed6e38cdd99ba71b7b92c'
MODEL_SHA='a1826980fc5c037e69c7ac94fcb56c03001a66f380eb71863cc0a3879e71421b'
FILES={'model.bin','config.json','shared_vocabulary.json','sentencepiece.bpe.model','MODEL-CARD.md','LICENSE-MODEL.txt'}
def digest(path):
    result=hashlib.sha256()
    with path.open('rb') as stream:
        while data:=stream.read(1024*1024):result.update(data)
    return result.hexdigest()

target=Path(sys.argv[1]);cache=Path(sys.argv[2]);cache.mkdir(parents=True,exist_ok=True)
if target.is_symlink():raise RuntimeError('Unsafe model folder')
archive=cache/'caption-translation-model-v1.zip'
if not archive.is_file() or digest(archive)!=SHA:
    temporary=archive.with_suffix('.download')
    if temporary.is_symlink():raise RuntimeError('Unsafe download path')
    for attempt in range(3):
        try:
            with urllib.request.urlopen(URL,timeout=60) as response,temporary.open('wb') as output:shutil.copyfileobj(response,output,1024*1024)
            if digest(temporary)!=SHA:raise RuntimeError('Translation model checksum mismatch')
            temporary.replace(archive);break
        except OSError:
            if attempt==2:raise
target.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(archive) as package:
    if set(package.namelist())!=FILES or sum(item.file_size for item in package.infolist())>600*1024*1024:
        raise RuntimeError('Unexpected model archive')
    for name in FILES:
        destination=target/name
        if destination.is_symlink():raise RuntimeError('Unsafe model output')
        with package.open(name) as source,destination.open('wb') as output:shutil.copyfileobj(source,output,1024*1024)
if digest(target/'model.bin')!=MODEL_SHA:raise RuntimeError('Translation model bytes changed')
print('Verified portable M2M100 int8 model, pinned upstream revision and license.',flush=True)
