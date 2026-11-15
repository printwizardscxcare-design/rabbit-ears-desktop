# rabbit-ears.stream desktop 0.1.0 Beta 7

- Settings → Captions → Language saves one of ten languages with browser/Discord preferences.
- Bundled local translation for shows without subtitle tracks. Multilingual Whisper detects speech and supplies English text; M2M100 translates it locally. Playback continues while captions catch up. No Python installation, model download or translation account is needed.
- Existing stream subtitles retain priority. Saved site translations load independently of programming. Captions embedded in the picture are labeled honestly.
- Controls and Audio windows follow all nine themes. Controls preserves unsaved bindings while changing themes.
- Original design has a visible back arrow, including cached pages in the app.
- Visible app titles use rabbit-ears.stream desktop. The existing profile identity is preserved.

Machine translation is approximate. Burned-in text is part of the picture. Mac packages are ad-hoc signed, not notarized; Mac/Linux updates remain manual. A full installed previous-version upgrade is not yet tested.

Validation: 119 Node tests; real Chromium checks for 20 caption styles, nine-theme Audio/Controls, unsaved bindings, native menus and compact/return mode; bundled translation helper smoke test across ten languages and Unicode. Each platform must pass native speech and translation checks before publication.
