# Windows beta release path

1. Increment package.json and package-lock.json to a new semver prerelease, e.g. 0.1.0-beta.2.
2. Run npm test, the real Electron audio check, caption precedence checks and the packaged native-engine tests. Build the Windows NSIS installer.
3. Create a vVERSION tag and a GitHub prerelease on printwizardscxcare-design/rabbit-ears-desktop. Upload the Setup.exe, Setup.exe.blockmap, beta.yml and SHA256SUMS.txt from the same build. Do not edit updater metadata by hand.
4. The Windows workflow builds tagged releases and uploads the complete set to a draft release. Review and publish that draft only after the checks pass. Existing beta clients discover the published prerelease.
5. Check one installed previous version: Help → Check for app updates → Download update → Later → restart/install. Confirm the app version changes and captions/audio/theme/site sign-in preferences survive. Verify cancellation, offline handling and corrupted installer rejection too.

The feed is configured in package.json build.publish; electron-builder embeds app-update.yml into the installer. The installed app uses electron-updater 6.8.11 with beta allowed, downgrade disabled, automatic download disabled and installation on quit disabled. It checks at startup after 20 seconds and manually from Help. A downloaded update is only installed on an explicit restart action.

This first Windows beta is unsigned. Add a Windows signing certificate in CI before the stable public rollout; do not commit signing credentials. Signing and notarization are additionally required before claiming in-app updates on macOS. Linux package-manager updates are outside this Windows delivery.
