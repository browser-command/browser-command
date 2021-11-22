import { Entity, World, Packet } from '@browser-command/core';

export class Client {
	public world: World = new World();
	public socket: WebSocket = new WebSocket('ws://localhost:3000');

	public constructor() {}

	public update(delta: number): void {
		this.world.update(delta);
	}

	public send() {
		const packet = new Packet();
		packet.writeInt(1024);
		packet.writeBoolean(true);

		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(packet.toUint8Array());
		}
	}
}
