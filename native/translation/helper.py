"""Local caption translation, JSON lines over stdin/stdout. No network or audio access."""
import argparse
import json
import sys
from pathlib import Path
import ctranslate2
import sentencepiece

LANGUAGES={'en','zh','hi','es','ar','fr','bn','pt','id','ur'}

class Engine:
    def __init__(self,model):
        self.sp=sentencepiece.SentencePieceProcessor(model_file=str(Path(model)/'sentencepiece.bpe.model'))
        self.model=ctranslate2.Translator(str(model),device='cpu',compute_type='int8',inter_threads=1,intra_threads=2)

    def translate(self,text,source,target):
        if source==target:
            return text
        # One sentence per inference improves small-model reliability on short captions.
        import re
        sentences=re.split(r'(?<=[.!?。！？])\s+',text.strip())
        inputs=[['__'+source+'__']+self.sp.encode(s,out_type=str)+['</s>'] for s in sentences]
        if any(len(tokens)>900 for tokens in inputs):
            raise ValueError('Caption is too long')
        results=self.model.translate_batch(inputs,target_prefix=[['__'+target+'__']]*len(inputs),beam_size=5,
            max_input_length=1024,max_decoding_length=384,no_repeat_ngram_size=3)
        texts=[self.sp.decode([t for t in r.hypotheses[0] if not t.startswith('__') and t not in ('</s>','<s>','<pad>')]) for r in results]
        if any(not t.strip() for t in texts):
            raise ValueError('Empty translation')
        return ' '.join(texts)

def main():
    sys.stdin.reconfigure(encoding='utf-8')
    parser=argparse.ArgumentParser();parser.add_argument('--model',required=True);args=parser.parse_args()
    engine=Engine(args.model)
    for line in sys.stdin:
        request={}
        try:
            request=json.loads(line)
            if request.get('source','en') not in LANGUAGES or request.get('target') not in LANGUAGES or not isinstance(request.get('text'),str) or len(request['text'])>6000:
                raise ValueError('Invalid caption translation request')
            output={'id':request.get('id'),'text':engine.translate(request['text'],request.get('source','en'),request['target'])}
        except Exception:
            output={'id':request.get('id'),'error':'Caption translation unavailable'}
        print(json.dumps(output,ensure_ascii=True),flush=True)

if __name__=='__main__':main()
