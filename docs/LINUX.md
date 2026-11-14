# Linux installation

The Linux x64 beta packages passed installation, caption recognition and startup checks on Debian 13, Fedora 43 and Arch. Direct downloads are on the [front page](../README.md). Use a normal desktop session with audio support; internet is needed for streams.

Download the matching package from the [release page](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/tag/v0.1.0-beta.5), then run the appropriate command in the folder containing it.

## Debian and Ubuntu

[Download the Debian/Ubuntu .deb package](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.5/Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Debian-amd64.deb). Debian 12+ or a compatible Ubuntu desktop is the target; release validation includes Debian 13.

```sh
sudo apt install ./Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Debian-amd64.deb
```

## Fedora

[Download the Fedora .rpm package](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.5/Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Fedora-x86_64.rpm). Release validation uses Fedora 43.

```sh
sudo dnf install ./Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Fedora-x86_64.rpm
```

## Arch Linux

[Download the Arch .pkg.tar.xz package](https://github.com/printwizardscxcare-design/rabbit-ears-desktop/releases/download/v0.1.0-beta.5/Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Arch-x64.pkg.tar.xz). Update Arch before installing it:

```sh
sudo pacman -Syu
sudo pacman -U ./Rabbit-Ears-stream-Desktop-0.1.0-beta.5-Arch-x64.pkg.tar.xz
```

## Open the app

Choose **Rabbit-Ears.stream Desktop** from your applications menu, or run `rabbit-ears-stream`. Run it as your regular desktop user. Installer dependencies are handled by the package manager.

## Captions and audio

Stream subtitles are preferred; bundled Whisper and English models fill missing tracks without Python, a speech account, microphone permission or a model download. Caption generation does not pause or rewind the show. Normal playback uses your desktop’s PipeWire/PulseAudio-compatible audio setup. Windows Live Captions is Windows-only.

On Wayland, use your desktop’s Keep Above action if available; the app’s Always on top control is disabled there. On X11, View → Always on top is available.

## Update or uninstall

Quit the app and install a newer package using the same command. This beta uses package-manager installation on Linux; in-app installation is currently Windows-only. Your preferences remain in ~/.config/Rabbit-Ears.stream Desktop/.

```sh
# Debian / Ubuntu
sudo apt remove rabbit-ears-stream-desktop
# Fedora
sudo dnf remove rabbit-ears-stream-desktop
# Arch
sudo pacman -R rabbit-ears-stream-desktop
```
