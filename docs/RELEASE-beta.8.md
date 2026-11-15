# rabbit-ears.stream desktop 0.1.0 Beta 8

- App language changes the interface, native menus, Audio and Controls windows, and subtitle preference. Ten languages are available, including English.
- Automatic uses device preferences, with a coarse regional fallback on the site. Saved manual choices take precedence. No GPS permission is requested.
- Matching channel logo images have translated lettering built into the artwork, with light/dark variants. Original pixel illustrations stay intact.
- Interface translation leaves programme titles, viewer comments, media and the programme clock intact. Arabic and Urdu use right-to-left layouts.
- Caption translation remains local in the app; saved site translations arrive from the independent Skippy queue. Original subtitles remain available while a translated track is pending.
- Portable, checksummed model packaging fixes Intel Mac builds without requiring a platform-specific conversion toolchain. Users need no Python installation or model download.

Checks include 119 Node tests, native menu/settings language changes, unsaved Controls drafts, all nine themes, twenty caption appearance comparisons, compact/return mode, and real browser language/RTL/logo/layout checks. Every platform must also pass packaged speech and ten-language translation tests before publication.

Translations can be imperfect. Mac packages are ad-hoc signed, not notarized. Mac/Linux updates remain manual. A full installed previous-version upgrade has not yet been tested.
