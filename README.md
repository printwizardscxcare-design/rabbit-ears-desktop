# rabbit-ears.stream desktop

A dedicated desktop app for [rabbit-ears.stream](https://rabbit-ears.stream/).

**[Windows and Apple Silicon Beta 6 are available](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/tag/v0.1.0-beta.6)** with a lowercase app title, compact cached-page footer, header beer button, permanent Discord link and theme-matched scrollbars. The remaining platform updates are being verified; their working Beta 5 downloads remain below.

## Download

| Your computer | Download | Install instructions |
| --- | --- | --- |
| Windows 10/11 · Intel/AMD 64-bit | **[Download Windows installer (.exe)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.6/Rabbit-Ears-stream-Desktop-0.1.0-beta.6-Windows-x64-Setup.exe)** | [Windows guide](docs/WINDOWS.md) |
| Mac · Apple Silicon · macOS 14.2+ | **[Download Apple Silicon (.dmg)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.6/Rabbit-Ears-stream-Desktop-0.1.0-beta.6-Mac-arm64.dmg)** | [Mac guide](docs/MAC.md) |
| Mac · Intel · macOS 14.2+ | **[Download Intel Mac (.dmg)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.5/Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Mac-x64.dmg)** | [Mac guide](docs/MAC.md) |
| Debian/Ubuntu · Intel/AMD 64-bit | **[Download Debian (.deb)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.5/Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Debian-amd64.deb)** | [Debian guide](docs/LINUX.md#debian-and-ubuntu) |
| Fedora · Intel/AMD 64-bit | **[Download Fedora (.rpm)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.5/Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Fedora-x86_64.rpm)** | [Fedora guide](docs/LINUX.md#fedora) |
| Arch Linux · Intel/AMD 64-bit | **[Download Arch (.pkg.tar.xz)](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.5/Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Arch-x64.pkg.tar.xz)** | [Arch guide](docs/LINUX.md#arch-linux) |

[All release files and checksums](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/tag/v0.1.0-beta.5) · [Caption help](docs/CAPTIONS.md) · [Audio settings](docs/AUDIO.md) · [Report a problem](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/issues)

Install the package for your computer, rather than GitHub’s Source code ZIP. The Windows beta is unsigned; macOS builds are ad-hoc signed and not Apple-notarized. Internet is required for streams. Speech models are included in the installers.

The live TV guide, radio, themes, Discord login and account preferences come from Rabbit Ears.

## Captions

Captions are on by default. Existing stream subtitle tracks are used first, including English tracks already translated by the site. Text already embedded in the picture suppresses local recognition. Loading tracks are allowed to finish; broken tracks can fall back to recognition.

When no usable subtitles exist, the selected local engine fills in:

- **Whisper (default):** the engine and tiny/base English models are bundled; no account, model download, microphone setup or separate install. Recognition reads the public Archive file and follows media timestamps. Playback is never paused or rewound to prepare captions. Slower computers may show captions late.
- **Windows Live Captions:** optional on Windows 11 22H2 or newer. Windows may need its own speech-language files on first use. This option reads Windows' live-caption output, so other audible apps may be included.

The app Captions menu controls On/Off, the fallback engine, size, color, timing and recognition speed. Size and color apply equally to supplied subtitle tracks and local engine captions. The site player’s CC color choices also update the app preference, without writing to the website’s saved profile. Burned-in text cannot be switched off. Whisper's bundled models recognize English; they do not translate foreign speech. Captions remain local and are not uploaded to the site.

## Audio and controls

The Audio menu retains the desktop engine: tape-hiss reduction, normalization, compression, makeup gain, a 10-band graphical EQ, factory and custom presets. The Audio window follows the current skin on opening and while you change themes, including Windows. Preferences save locally. Effects are optional; original sound is the initial preset. Audio processing in this app does not re-enable the retired website audio engine.

Keyboard/controller bindings, video fullscreen, zoom and Always on top are available in the desktop menus. The underlying site's controls remain available.

## Compact player

Click **Pop out** to turn this same window into a compact, borderless TV with its themed bezel and transport. It opens no second player/window and keeps the same video, position and pause state. Drag the TV bezel, video or empty panel space to move it, and resize the edges. **Return** restores the full app, all app menus and its previous bounds/maximized state. Rabbit Ears, Navigate, View, Captions, Audio, Settings and Help remain visible in the normal app; only Pop out and video fullscreen hide this menu row. **Ctrl+Shift+P** (Command+Shift+P on Mac) also toggles it. Compact mode stays above other windows where the OS supports it; Wayland uses the desktop’s window-manager controls.

## Support the team

**Help → Buy the team a beer** opens the [team support page](https://rabbit-ears.stream/support/). The website footer and both repositories' Sponsor buttons lead to the same [Rabbit Ears Ko-fi fund](https://ko-fi.com/rabbitears). Support is optional and does not change access to shows or app features.

## In-app updates

The installed Windows app checks GitHub Releases at startup. Help → Check for app updates checks manually. Updates ask before downloading and before restarting; no downgrade and no installation on ordinary quit. Your profile stays in place. Beta installs follow beta releases. The updater uses electron-updater's HTTPS feed and SHA-512 installer verification; this first beta is not Authenticode-signed. Certificate signing should be added before a broad stable release.

Future releases must publish the NSIS installer, its blockmap and beta.yml together. See [release instructions](docs/RELEASING.md). An upgrade from one published version to another still needs a real two-version installer test.

## Development

`npm ci`, then `npm start`. Build native caption helpers with `npm run build:captions`; build Windows installers with `npm run dist`. `npm test` checks caption precedence, nonblocking playback, controls, audio and update decisions. Build Mac DMG/ZIP packages with `npm run dist:mac` on the matching Mac architecture. Build Debian, Fedora and Arch packages with `npm run dist:linux` on Linux. The Mac/Linux workflows build the bundled engines and check the resulting apps/packages.
