# Local caption translation

The app bundles Meta's [M2M100 418M](https://huggingface.co/facebook/m2m100_418M), revision `55c2e61bbf05dfb8d7abccdc3fae6fc8512fd636`, converted to int8 with CTranslate2. The upstream model card declares MIT. Its model card is distributed beside the model.

The translation runtime uses [CTranslate2](https://github.com/OpenNMT/CTranslate2) (MIT), [SentencePiece](https://github.com/google/sentencepiece) (Apache 2.0), NumPy (BSD), and CPython (PSF). PyInstaller's exception permits distribution of the frozen helper. Package license metadata is included in the helper folder.

Translation runs locally, in a separate process limited to two inference threads. Machine translation can mistranslate dialogue and names. The original caption track stays available. Recognition and translation do not change the media or programme clock.
