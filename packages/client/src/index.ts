import { registerNetworked } from '@browser-command/core';

function loop() {
	requestAnimationFrame(loop);
}

loop();
