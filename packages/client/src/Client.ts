import socket from 'socket.io-client';
import { Engine } from '@browser-command/core';

import { Synchronizer, SyncStrategy } from './sync';

export class Client extends Engine {
	public connected = false;
	public config = { host: 'localhost', port: 3000 };
	public socket = socket(`ws://${this.config.host}:${this.config.port}`, {
		autoConnect: false,
	});

	public synchronizer = new Synchronizer(this, SyncStrategy);

	public async connect(): Promise<void> {
		if (this.connected) {
			return;
		}

		console.log(`Connecting to ${this.config.host}:${this.config.port}`);

		return new Promise((resolve, reject) => {
			this.socket.once('connect', () => {
				console.log('Connected to server');
				resolve();
			});

			this.socket.once('error', (error) => {
				console.log('Connection error', error);
				reject(error);
			});

			this.socket.on('server:snapshot', (buffer) => {
				console.log(this.serializer.deserialize(buffer));
			});

			this.socket.on('server:payload', (buffer) => {
				console.log(this.serializer.deserialize(buffer));
			});

			this.socket.connect();
		});
	}

	public initialize(): void {
		super.initialize();

		this.connected = false;

		this.connect().then(() => {
			this.connected = true;
		});
	}

	public disconnect(): void {
		if (this.connected) {
			this.socket.disconnect();
			this.connected = false;
		}
	}
}
