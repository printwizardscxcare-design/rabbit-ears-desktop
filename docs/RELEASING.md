# Windows beta release path

1. Increment package.json and package-lock.json to a new semver prerelease, e.g. 0.1.0-beta.2.
2. Run npm test, the real Electron audio check, caption precedence checks and the packaged native-engine tests. Build the Windows NSIS installer.
3. Create a vVERSION tag and a GitHub prerelease on printwizardscxcare-design/rabbit-ears-desktop. Upload the Setup.exe, Setup.exe.blockmap, beta.yml and SHA256SUMS.txt from the same build. Do not edit updater metadata by hand.
4. The Windows workflow builds tagged releases and uploads the complete set to a draft release. Review and publish that draft only after the checks pass. Existing beta clients discover the published prerelease.
5. Check one installed previous version: Help → Check for app updates → Download update → Later → restart/install. Confirm the app version changes and captions/audio/theme/site sign-in preferences survive. Verify cancellation, offline handling and corrupted installer rejection too.

The feed is configured in package.json build.publish; electron-builder embeds app-update.yml into the installer. The installed app uses electron-updater 6.8.11 with beta allowed, downgrade disabled, automatic download disabled and installation on quit disabled. It checks at startup after 20 seconds and manually from Help. A downloaded update is only installed on an explicit restart action.

This first Windows beta is unsigned. Add a Windows signing certificate in CI before the stable public rollout; do not commit signing credentials. Signing and notarization are additionally required before claiming in-app updates on macOS. Linux package-manager updates are outside this Windows delivery.

## Mac and Linux release assets

Run the Mac installers and Linux installers workflows on the release source. Publish each Mac DMG/ZIP pair only after its architecture job passes, and Linux packages only after the Debian, Fedora and Arch install/launch checks pass. Upload each platform’s SHA256SUMS file with its artifacts. Update the download table and platform guides to the exact published filenames, then check every public link. Keep Windows beta.yml unchanged when adding other-platform assets to the same beta. Mac/Linux beta updates currently use replacement installers/packages rather than automatic installation.


## Publish checked artifacts without local downloads

After a beta release exists, run **Publish verified platform downloads** with its tag, successful build-run ID and artifact name. Accepted artifacts are `Rabbit-Ears-stream-Desktop-Mac-arm64`, `Rabbit-Ears-stream-Desktop-Mac-x64`, and `Rabbit-Ears-stream-Desktop-Linux-x64`.

The publication job requires the correct build workflow and matching app version/source, packaging scripts and build workflow files. Each Mac architecture must have a successful job; Linux requires the complete build plus all three clean installation checks. The caption appearance test helper may differ because it is not shipped in the app; this permits test timing repairs without rebuilding unchanged app code merely to change test waits.

It verifies the build's SHA-256 manifest, uploads its package files and checksum list, and checks every published GitHub digest. Existing assets are retained only if their digest already matches; mismatched files stop publication. It never replaces the Windows beta feed. This avoids transferring every platform's large artifacts through a developer's computer.
