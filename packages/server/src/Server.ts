import socket from 'socket.io';
import { Datatype, Engine, GameLoop, Snapshot, Unit } from '@browser-command/core';

import { Client } from './network';

export class Server extends Engine {
	public clients = new Set<Client>();
	private unit: Unit | undefined;

	public constructor(private connection: socket.Server) {
		super();

		this.network.register('client:connect', {
			id: { type: 'string' },
		});

		this.network.register('client:disconnect', {
			id: { type: 'string' },
		});

		this.connection.on('connection', (socket) => {
			this.connect(socket);
		});
	}

	initialize() {
		super.initialize();

		this.unit = this.entities.create<typeof Unit>('unit', this.world);
		this.unit.model = '/models/m1-ship1.obj';
		this.unit.spawn();
	}

	private connect(socket: socket.Socket) {
		console.log(`Client connected: ${socket.id}`);
		const client = new Client(socket);
		this.clients.add(client);

		client.on('disconnect', () => {
			this.disconnect(client);
			this.network.emit('client:disconnect', { id: client.id });
		});

		// this.network.emit('client:connect', { id: client.id });

		this.emit('player:connect', client);
	}

	private disconnect(client: Client) {
		this.emit('player:disconnect', client);
		this.clients.delete(client);
	}

	public start() {
		super.start();

		const loop = new GameLoop({
			tps: 20,
			tick: (delta) => {
				this.emit('update');
				this.update(delta);
				this.emit('update:end');
				this.sync(true);
			},
		});

		loop.start();
	}

	public update(delta: number) {
		if (this.unit) {
			this.unit.position.y = Math.sin(performance.now() / 1000) * 100;
		}
	}

	private sync(full = false): void {
		const { world, clients, network } = this;

		const payload = network.serialize();

		for (const client of clients) {
			client.send('payload', payload);

			const snapshots = [...client.snapshots];
			const recent = snapshots.find((s) => s && s.acknowledged);

			const snapshot = new Snapshot();
			snapshot.type = full || !recent ? 'full' : 'partial';
			snapshot.entities = world.entities;

			const data = this.serializer.serialize(snapshot);

			client.send('snapshot', data);
		}

		network.flush();
	}
}
