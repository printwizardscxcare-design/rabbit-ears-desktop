# Desktop logo

This desktop logo belongs to the shared 8-bit Gruvbox project family. It does not change the upstream website's branding.

Created with the built-in image generation tool. The project artwork is included under this repository's MIT license.

Prompt specification: A cream rabbit skull with upright ears inside a charcoal CRT television badge, with orange knobs. Crisp 8-bit pixel art, stepped contours, strong silhouette readable at small sizes, centered square composition with transparent margins. Gruvbox palette: charcoal, cream, gold, olive, orange and red. No lettering or watermark.

`icon.png` is the approved source. `scripts/make-icon.ps1` rebuilds the Windows ICO at 16, 24, 32, 48, 64, 128 and 256 pixels without replacing that source. Linux and the app window use the PNG. The Mac build converts it to ICNS.

The README displays the logo immediately. Packaged apps pick it up when a new installer release is built.
