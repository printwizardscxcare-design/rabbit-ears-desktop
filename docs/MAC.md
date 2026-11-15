# Mac installation

Requires **macOS 14.2 or newer** and internet for streams. Choose the package matching your processor. See the [validation record](VALIDATION.md) for checks and remaining limits.

## Choose the right Mac build

Open **Apple menu → About This Mac**:

| Chip or processor | Choose |
| --- | --- |
| Apple M-series chip | [Download Apple Silicon / arm64 DMG](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.8/Rabbit-Ears-stream-Desktop-0.1.0-beta.8-Mac-arm64.dmg) |
| Intel processor | [Download Intel / x64 DMG](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.8/Rabbit-Ears-stream-Desktop-0.1.0-beta.8-Mac-x64.dmg) |

## Install and open

1. Download the DMG for your processor from the [Rabbit Ears release page](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/tag/v0.1.0-beta.8).
2. Open it and drag **Rabbit-Ears.stream Desktop** into **Applications**.
3. Eject the mounted disk image and open the app from Applications.

The beta is ad-hoc signed, not notarized by Apple. macOS may block its first launch. If you trust the download and wish to proceed, follow [Apple’s instructions for opening an unidentified app](https://support.apple.com/en-us/102445): after the blocked attempt, check System Settings → Privacy & Security for the app’s Open Anyway option. Do not disable Gatekeeper globally.

## Captions and audio

Existing show subtitles are preferred. Multilingual Whisper and the local translation model are bundled and use the stream file directly; no microphone or audio-recording permission is needed for that path. Settings → App language offers Automatic and ten languages for the interface and subtitles. Automatic follows a supported device language, then a broad country fallback; saved manual choices win. No Python, speech account or model download is needed. Windows Live Captions is Windows-only. Audio → Settings retains the EQ, leveling, denoising and saved presets.

## Updates and removal

For this Mac beta, quit the app and replace the app in Applications using the newer DMG. In-app installation is Windows-only until Apple signing/notarization and the Mac update flow are set up and tested. Remove the app from Applications to uninstall; preferences remain in ~/Library/Application Support/Rabbit-Ears.stream Desktop/.
