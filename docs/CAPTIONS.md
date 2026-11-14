# Captions

Captions start on. Rabbit Ears first uses the subtitle track supplied with the show, including translated English tracks published by the site. It does not run a second recognizer over working subtitles or captions already in the picture.

## Shows with existing subtitles

Use the player’s **CC** button for the site’s white/yellow text and backing choices. A subtitle track may take a moment to load; loading is not treated as missing. If a track fails, the desktop app can fall back to local recognition. Text embedded in the picture is part of the video and cannot be switched off.

## Shows without subtitles

**Whisper** is the default fallback on Windows, Mac and Linux. The engine, media tools and English tiny/base models are included in the installer. No Python, speech account, microphone setup or model download is needed. Faster uses tiny English; Balanced uses base English. Recognition reads the media file and follows the player’s timestamps. It never pauses or rewinds the show; a slow computer can produce late captions.

**Windows Live Captions** is an optional fallback on Windows 11 22H2+. Windows may ask for its own speech-language download the first time. This mode reads Windows’ caption output and can include other audible apps. It is not available on Mac or Linux.

## Controls

Use **Captions → On / Off** in the desktop menu. Toggle with **Ctrl+Shift+L** on Windows/Linux or **Command+Shift+L** on Mac. The menu also provides the local engine, recognition speed, text size, white/yellow text and subtitle delay. Use the site CC menu to style a supplied stream track.

The local Whisper models recognize English and do not translate foreign speech. Existing English translations from the site are still used normally. Recognition can make mistakes, especially on noisy recordings or music. Locally generated captions are not uploaded to the website.

## Troubleshooting

If subtitles are absent, check that Captions is On and the show is playing. For Whisper, try Faster and allow time for the Archive connection and recognition to catch up. Re-tune if a source is unavailable. For Windows Live Captions, complete the OS feature’s own setup. See [Mac installation](MAC.md), [Linux installation](LINUX.md), or [Windows installation](WINDOWS.md) for platform setup.
