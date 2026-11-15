# Captions

Captions start on. Rabbit Ears uses a working stream subtitle track first and avoids duplicate recognition over captions already in the picture.

## Language

Choose **Settings (gear) → App language** for Automatic or English, Mandarin Chinese, Hindi, Spanish, Arabic, French, Bengali, Portuguese, Indonesian or Urdu. The selection also changes the interface, native menus, Audio and Controls windows, and channel-logo lettering. Automatic uses a supported device language, with a broad country fallback; an explicit saved choice takes priority. It never requests GPS access. The choice stays in the browser profile and syncs when signed in with Discord.

The website plays saved translations as they finish in Skippy's separate queue. It keeps the original captions when the selected language is not ready. Website playback runs no live speech recognition or translation. Caption updates never change programming.

## Shows without subtitles

Whisper is the default fallback on Windows, Mac and Linux. The installer includes multilingual tiny/base speech models, media tools and a local translation model. No Python installation, speech account or model download is needed. Faster uses tiny; Balanced uses base. Whisper detects speech and supplies English text, which M2M100 translates into the selected language locally. A separate CPU process handles translation. Recognition and translation never pause or rewind the show; captions may arrive late on slower computers.

Windows Live Captions remains optional on Windows 11 22H2+. Windows may request its own speech-language download. Translation uses its English caption output. This engine can capture other audible apps and is unavailable on Mac/Linux. Buffered Whisper reads only the channel's media file.

## Appearance and controls

Use the desktop Captions menu for size and white/yellow text on stream tracks and local captions. The player's CC color choices update the same local app preference. These appearance choices do not overwrite the website's profile. Toggle captions through Captions → On / Off, Ctrl+Shift+L on Windows/Linux, or Command+Shift+L on Mac.

Loading tracks are not treated as missing. A failed track permits local fallback. Captions printed into the picture are identified as embedded and cannot be removed or restyled; translating them requires an independent timed-text track.

Machine recognition and translation can mistranslate dialogue and names, especially in noisy material and less well represented languages. Original captions remain available by selecting their language. Local app captions are not uploaded to the site. The translation helper has no network or audio access.

If captions are absent, check that they are On, allow processing time and try Faster recognition. See [Windows](WINDOWS.md), [Mac](MAC.md) or [Linux](LINUX.md) installation instructions.
