from pathlib import Path
import sys
from huggingface_hub import snapshot_download
from ctranslate2.converters import TransformersConverter
import shutil

output=Path(sys.argv[1]);output.mkdir(parents=True,exist_ok=True)
source=Path(snapshot_download('facebook/m2m100_418M',revision='55c2e61bbf05dfb8d7abccdc3fae6fc8512fd636',
    allow_patterns=['config.json','pytorch_model.bin','sentencepiece.bpe.model','vocab.json','tokenizer_config.json','special_tokens_map.json','README.md']))
if not (output/'model.bin').exists():
    TransformersConverter(str(source)).convert(str(output),quantization='int8',force=True)
shutil.copyfile(source/'sentencepiece.bpe.model',output/'sentencepiece.bpe.model')
shutil.copyfile(source/'README.md',output/'MODEL-CARD.md')
