import { RingBuffer, Snapshot } from '@browser-command/core';
import { Socket } from 'socket.io';
import { EventEmitter2 } from 'eventemitter2';
import * as Buffer from 'buffer';

export class Client extends EventEmitter2 {
	public readonly id: string;
	public snapshots: RingBuffer<Snapshot>;

	private initial: Snapshot = new Snapshot();

	public constructor(private socket: Socket) {
		super();

		this.id = socket.id;

		this.snapshots = new RingBuffer(32);

		this.socket.on('disconnect', () => {
			this.emit('disconnect');
		});
	}

	public send(event: string, data: Uint8Array) {
		this.socket.emit(event, data);
	}
}
