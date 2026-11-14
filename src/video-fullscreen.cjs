'use strict';

// Executed with a user gesture by Electron, only on the pinned site origin.
function toggleVideoFullscreen() {
  if (location.origin !== 'https://rabbit-ears.stream') return false;
  if (document.fullscreenElement) return document.exitFullscreen();
  const button = document.querySelector('#full');
  if (button && !button.disabled) {button.click();return true;}
  const player = document.querySelector('#screen');
  if (player?.requestFullscreen) return player.requestFullscreen();
  return false;
}
module.exports = {toggleVideoFullscreen};
