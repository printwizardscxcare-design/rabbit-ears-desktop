# Testing

Run `npm ci` and `npm test` for caption precedence, playback continuity, settings, controls, language selection and update decisions. Build helpers and the preload before testing an installed or packaged app; see [development and packaging commands](../README.md#development).

The real Electron checks in `scripts/check-caption-appearance.cjs` cover native menus, interface-language changes, Audio and Controls windows, unsaved control drafts, caption appearance, themes and compact/Return behavior. `scripts/check-translation.cjs` checks the bundled local translation helper and language output. Use the scripts' documented inputs and the matching platform build; Node-only results do not establish that a packaged helper works.

Before publication, each platform must pass its packaged speech and ten-language translation checks. Check every installer against its release checksum and verify its public download URL. Windows must publish the installer, blockmap and `beta.yml` together; see [release instructions](RELEASING.md).

[Validation record and limits](VALIDATION.md) tracks completed checks. A real upgrade between two installed published Windows versions remains outstanding. Mac notarization and automatic Mac/Linux installation are not provided by this beta.
