# Initial Windows validation

110 Node checks passed: reused audio/controls/timestamp/source validation plus Rabbit Ears stream-first caption selection, live playback preservation and updater decisions. The sandboxed preload exposes no Node/IPC functions to the remote website. Its availability messages are accepted only from the pinned main frame.

The packaged caption helpers passed actual base/tiny English recognition, timestamped cue output, silence-aware clocks, the packaged FFmpeg-to-Whisper read-ahead pipeline, HTTPS support and process cleanup. The real Electron audio check passed all ten EQ bands, Pre/Post EQ, makeup, denoising, presets and save/reopen persistence.

Existing site tracks are preferred; loading tracks stop the fallback and broken tracks permit it. Burned-in captions are signaled read-only by the site. Native Windows Live Captions still needs the Windows 11 OS feature and any required language pack; that feature is not provisioned by this installer.

The initial release includes update feed metadata and controller tests. A genuine later-version NSIS update and settings migration must be tested when beta.2 exists. macOS/Linux Rabbit Ears installers have not been tested or released.

The real sandboxed Electron app opened the live Rabbit Ears site, selected Pixel Deck, exposed no window.require, and initialized its caption policy without renderer/preload errors. Screenshots are in docs/screenshots.
The public beta feed was checked with the real electron-updater/Electron HTTP client after publishing. It resolved 0.1.0-beta.1 as the current version, did not download anything and rejected downgrades. The public installer URL returned HTTP 200 with the expected file size, and GitHub's uploaded SHA-256 digest matched SHA256SUMS.txt. A real later-version installation still needs the beta.2 upgrade test described in RELEASING.md.
