# Rabbit-Ears.stream Desktop

A dedicated desktop app for [Rabbit-Ears.stream](https://rabbit-ears.stream/).

## Download · 0.1.0 Beta 1

| Your computer | Download | Install instructions |
| --- | --- | --- |
| Windows 10/11 · Intel/AMD 64-bit | **[Download Windows installer (.exe)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.1/Rabbit-Ears-stream-Desktop-0.1.0-beta.1-Windows-x64-Setup.exe)** | [Windows guide](docs/WINDOWS.md) |
| Mac · Apple Silicon · macOS 14.2+ | **[Download Apple Silicon (.dmg)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.1/Rabbit-Ears-stream-Desktop-0.1.0-beta.1-Mac-arm64.dmg)** | [Mac guide](docs/MAC.md) |
| Mac · Intel · macOS 14.2+ | **[Download Intel Mac (.dmg)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.1/Rabbit-Ears-stream-Desktop-0.1.0-beta.1-Mac-x64.dmg)** | [Mac guide](docs/MAC.md) |
| Debian/Ubuntu · Intel/AMD 64-bit | Build and checks in progress | [Debian guide](docs/LINUX.md#debian-and-ubuntu) |
| Fedora · Intel/AMD 64-bit | Build and checks in progress | [Fedora guide](docs/LINUX.md#fedora) |
| Arch Linux · Intel/AMD 64-bit | Build and checks in progress | [Arch guide](docs/LINUX.md#arch-linux) |

[All release files and checksums](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/tag/v0.1.0-beta.1) · [Caption help](docs/CAPTIONS.md) · [Audio settings](docs/AUDIO.md) · [Report a problem](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/issues)

Install the package for your computer, rather than GitHub’s Source code ZIP. The Windows beta is unsigned; macOS builds are ad-hoc signed and not Apple-notarized. Internet is required for streams. Speech models are included in the installers.

The live TV guide, radio, themes, Discord login and account preferences come from Rabbit Ears.

## Captions

Captions are on by default. Existing stream subtitle tracks are used first, including English tracks already translated by the site. Text already embedded in the picture suppresses local recognition. Loading tracks are allowed to finish; broken tracks can fall back to recognition.

When no usable subtitles exist, the selected local engine fills in:

- **Whisper (default):** the engine and tiny/base English models are bundled; no account, model download, microphone setup or separate install. Recognition reads the public Archive file and follows media timestamps. Playback is never paused or rewound to prepare captions. Slower computers may show captions late.
- **Windows Live Captions:** optional on Windows 11 22H2 or newer. Windows may need its own speech-language files on first use. This option reads Windows' live-caption output, so other audible apps may be included.

Use the site's CC options for stream subtitles. The app Captions menu controls On/Off, the fallback engine, size, color, timing and recognition speed. Burned-in text cannot be switched off. Whisper's bundled models recognize English; they do not translate foreign speech. Captions remain local and are not uploaded to the site.

## Audio and controls

The Audio menu retains the desktop engine: tape-hiss reduction, normalization, compression, makeup gain, a 10-band graphical EQ, factory and custom presets. Preferences save locally. Effects are optional; original sound is the initial preset. Audio processing in this app does not re-enable the retired website audio engine.

Keyboard/controller bindings, video fullscreen, zoom and Always on top are available in the desktop menus. The underlying site's controls remain available.

## In-app updates

The installed Windows app checks GitHub Releases at startup. Help → Check for app updates checks manually. Updates ask before downloading and before restarting; no downgrade and no installation on ordinary quit. Your profile stays in place. Beta installs follow beta releases. The updater uses electron-updater's HTTPS feed and SHA-512 installer verification; this first beta is not Authenticode-signed. Certificate signing should be added before a broad stable release.

Future releases must publish the NSIS installer, its blockmap and beta.yml together. See [release instructions](docs/RELEASING.md). An upgrade from one published version to another still needs a real two-version installer test.

## Development

`npm ci`, then `npm start`. Build native caption helpers with `npm run build:captions`; build Windows installers with `npm run dist`. `npm test` checks caption precedence, nonblocking playback, controls, audio and update decisions. Build Mac DMG/ZIP packages with `npm run dist:mac` on the matching Mac architecture. Build Debian, Fedora and Arch packages with `npm run dist:linux` on Linux. The Mac/Linux workflows build the bundled engines and check the resulting apps/packages.
