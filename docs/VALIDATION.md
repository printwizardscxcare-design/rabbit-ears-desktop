# Desktop beta validation

## Windows

110 Node checks passed, including stream-first caption selection, live playback preservation, audio/controls/timestamps/source validation and update decisions. The real sandboxed Electron app opened the live site with Pixel Deck, exposed no window.require, and initialized its caption policy without renderer/preload errors. Screenshots are in docs/screenshots.

Packaged helpers passed actual base/tiny English recognition, timestamped cue output, silence-aware clocks, the packaged FFmpeg-to-Whisper read-ahead pipeline, HTTPS support and process cleanup. The real Electron audio panel passed all ten EQ bands, Pre/Post EQ, makeup, denoising, presets and save/reopen persistence.

## Mac

Both Apple Silicon (macos-15 runner) and Intel (macos-15-intel runner) passed unit tests, real Chromium audio/settings tests, packaged speech/model/FFmpeg tests, deep/strict code-signature verification, audio-capture helper checks and app startup. Their DMG and ZIP downloads were verified against the build checksums before publication. These are ad-hoc signed, not Apple-notarized builds; minimum configured OS is 14.2 and execution checks ran on macOS 15.

[Mac build and checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43645303965).

## Linux

The three x64 package formats were built on Ubuntu 22.04 with the bundled engines/models. Each was installed into its matching clean container: Debian 13, Fedora 43 and Arch Linux. All three passed recorded recognition, timestamped recognition under varied allocation patterns, the FFmpeg caption pipeline/audio-filter checks and GUI app startup under Xvfb. Only the isolated container smoke test disables Chromium sandboxing; installed launchers retain it. Public package checksums were verified before upload. Ubuntu is a compatible Debian-package target, not a separately executed validation environment.

[Linux packages and installation checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43645306408).

## Captions and updates

Existing stream tracks are preferred; loading tracks stop the fallback and broken tracks permit it. Burned-in captions are signaled read-only by the site. Windows Live Captions requires Windows 11 and any OS speech-language files; this installer does not provision that feature.

The published Windows beta feed was checked using the real electron-updater/Electron HTTP client. It resolved 0.1.0-beta.1 without downloading or allowing downgrade. The installer URL returned HTTP 200 with the expected size and its uploaded SHA-256 matched SHA256SUMS.txt. A later-version installation still needs the beta.2 upgrade test described in RELEASING.md. Mac/Linux currently update through replacement installers/packages, not automatic installation.
