import socket from 'socket.io-client';
import { Engine, GameLoop } from '@browser-command/core';

import { Synchronizer, SyncStrategy } from './sync';
import { ThreeRenderer } from './render';

export class Client extends Engine {
	public connected = false;
	public config = { host: 'localhost', port: 3000, standalone: false };
	protected socket = socket(`ws://${this.config.host}:${this.config.port}`, {
		autoConnect: false,
	});

	protected synchronizer = new Synchronizer(this, SyncStrategy);
	protected renderer = new ThreeRenderer(this);

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

			this.socket.on('snapshot', (buffer) => {
				this.emit('snapshot', this.serializer.deserialize(buffer));
			});

			this.socket.on('payload', (buffer) => {
				this.emit('payload', this.serializer.deserialize(buffer));
			});

			this.socket.connect();
		});
	}

	public start() {
		super.start();

		const loop = new GameLoop({
			frame: () => {
				this.emit('update');
				this.update();
				this.emit('update:end');
			},
		});

		loop.start();
	}

	public update(): void {
		this.synchronizer.update();
		this.renderer.update();
	}

	public initialize(): void {
		super.initialize();

		this.connected = false;

		if (!this.config.standalone) {
			this.connect().then(() => {
				this.connected = true;
			});
		}
	}

	public disconnect(): void {
		if (this.connected) {
			this.socket.disconnect();
			this.connected = false;
		}
	}
}
