# Desktop beta validation

## Beta 8: language release

The local suite passes 119 Node checks. Real Electron checks pass interface and native-menu switching across all nine translated languages, Arabic/Urdu right-to-left layout, Audio and Controls windows, an unsaved Controls draft, nine themes, 20 supplied/local caption appearance comparisons, and compact/Return behavior. Local translation checks cover all ten output languages, Unicode, cache reuse and Spanish-to-English translation.

Live website checks confirm translated interface text and actual translated SVG channel logos at desktop and phone widths, Automatic device-language selection, saved manual choices and Arabic/Urdu layout without page overflow. All 16 translated caption files available at the check matched their original source hashes and exact cue timing. The published program catalog remained byte-for-byte unchanged (SHA-256 `5f47cccc773fe7b2cc542954757ae3053b4d48ce3d483ab383d17b044f567de2`). These website checks do not establish desktop installer success.

Beta 8 packaged checks passed on Windows, Intel Mac, Apple Silicon Mac, Debian 13, Fedora 43 and Arch. These platform jobs cover the bundled speech/translation engines and their model files; the Mac jobs include signing checks, and the Linux distribution jobs include package installation/startup checks.

- [Windows packaged checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43665040837)
- [Intel Mac packaged checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43665068933/job/132662510957)
- [Apple Silicon Mac packaged checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43665575330/job/132664070234)
- [Linux build and all three distribution checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43665071106)

The first Mac run passed Intel while its Apple Silicon job failed; the subsequent Apple Silicon job passed. Each architecture must use its matching verified artifact. Publication still checks release-file digests and public URLs before download links are updated; passed source/local checks alone do not replace those checks.

Windows remains unsigned. Mac builds are ad-hoc signed, not Apple-notarized. Mac/Linux updates require a replacement app/package. A real upgrade between two installed published Windows versions has not been completed.

## Beta 5

Windows passed all 117 Node checks, real Electron menu/Audio-theme/caption/compact tests, packaged speech/audio helpers and installer-integrity checks. The published current-version update feed resolves Beta 5 without downloading or downgrading. Help now includes the team support page. A full installed-version upgrade remains a separate outstanding check.

- [Windows Beta 5 checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43653611097)
- [Mac Beta 5 checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43653611319)
- [Linux Beta 5 checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43653460952)

Both Mac architectures passed deep/strict signing, speech/model/audio and real appearance/theme/compact checks. Linux passed Debian 13, Fedora 43 and Arch clean installation/model/startup checks. Every public package was checked against its build SHA-256 manifest by the publication workflow; all six primary download URLs returned HTTP 200 with the expected sizes.

- [Apple Silicon publication and digests](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43654531031)
- [Intel Mac publication and digests](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43654740913)
- [Linux publication and digests](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43654666367)

The Beta 4 Intel Mac appearance test sampled a previous caption color after a fixed 50 ms delay on the slow runner. Its new installer was withheld. The Beta 5 check polls for the actual rendered color/font before asserting, retaining all 20 comparisons; this changes test synchronization, not app behavior.

## Beta 4

117 Node checks passed. Real Electron tests verify all nine Audio themes on first opening, while switching the player theme and after reopening. Panel/accent colors match each current skin, and theme changes do not write sound settings. The real Chromium audio graph, EQ, presets and native-close persistence checks passed on Windows; Pixel Deck, Retro Cabinet and Gutter Signal Audio windows were captured and visually inspected. A live-site check confirmed the Audio window and player palettes match across all nine skins. Theme previews are saved in docs/screenshots/audio-retro-beta4.png and docs/screenshots/audio-gutter-beta4.png.

The normal-menu, themed-bezel, same-window Return and 20 caption-appearance checks remain in the same real Electron test. Changes are desktop-only; website code, deployment and caption-profile writes are unaffected.

- [Windows Beta 4 build and checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43652103304)
- [Mac Beta 4 builds and checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43652104193)
- [Linux Beta 4 builds and installation checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43652106324)

## Beta 3

116 Node checks passed. Real Electron input clicks on each normal-app menu heading open the existing native submenu. The same check verifies that the menu row hides in Pop out and returns afterward, while the themed cabinet border, hardware rail and transport remain visible. It retains the 20 stream/engine caption appearance comparisons and checks that video, clock, pause state and bounds survive Return without reload or a second window.

A live-site check inside the desktop app verified bezel and transport layout across all nine skins at 360×320 and 640×440. The normal window was also captured and inspected with all seven menu headings visible. Website source/deployment were unchanged and caption-preference writes remained zero.

- [Windows Beta 3 build and checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43651314654)
- [Mac Beta 3 builds and checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43651314501)
- [Linux Beta 3 builds and installation checks](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/actions/runs/43651316845)

The packaged Windows helpers, installer integrity and current-version public update feed passed. A complete installed-version upgrade test remains outstanding. Signing and update limitations below still apply.

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
