# Desktop beta validation

## Beta 2

115 Node checks passed. The real Electron/Chromium test compares supplied tracks with engine output for all five sizes and both colors, windowed and fullscreen (20 comparisons). It also covers source changes, site CC controls, reload persistence and zero website caption-preference writes. Compact/Return preserves the same window, video, source, clock, pause state and original window bounds, without invoking the website popup.

The live site was also checked inside the desktop app: supplied-caption size/color changed, the compact screen and transport remained visible, and the website caption-preference write count stayed zero. These changes are desktop-only; no website source or deployment was changed.

Both Mac architectures and Debian 13, Fedora 43 and Arch passed the Beta 2 build and package checks described below, including the new appearance/compact test. All platform downloads were checked against their build SHA-256 manifests before upload. Windows packaged helpers and the NSIS installer/feed checks passed locally. The production update feed resolves Beta 2 without a download or downgrade; an installed Beta 1-to-2 upgrade still needs a separate end-to-end installer test. Mac/Linux use replacement installers/packages.

- [Windows Beta 2 build and UI checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43649867027)
- [Mac Beta 2 builds and checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43648559729)
- [Linux Beta 2 installation checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43648562793)

The original Windows CI attempt stopped before the UI test because its executable path resolved to multiple output lines. The linked rerun explicitly installs Electron and uses its executable path; app runtime code did not change for that correction.

The sections below record the original Beta 1 checks and platform limitations.

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
