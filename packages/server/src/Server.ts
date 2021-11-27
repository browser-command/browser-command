import socket from 'socket.io';
import { Datatype, Engine, Snapshot, Unit } from '@browser-command/core';

import { Client } from './network';

export class Server extends Engine {
	public clients = new Set<Client>();

	public constructor(private connection: socket.Server) {
		super();

		this.network.register('client:connect', {
			id: { type: Datatype.STRING },
		});

		this.network.register('client:disconnect', {
			id: { type: Datatype.STRING },
		});

		this.connection.on('connection', (socket) => {
			this.connect(socket);
		});
	}

	initialize() {
		super.initialize();

		this.entities.create('unit', this.world);
	}

	private connect(socket: socket.Socket) {
		console.log(`Client connected: ${socket.id}`);
		const client = new Client(socket);
		this.clients.add(client);

		client.on('disconnect', () => {
			this.disconnect(client);
			this.network.emit('client:disconnect', { id: client.id });
		});

		this.emit('player:connect', client);
	}

	private disconnect(client: Client) {
		this.emit('player:disconnect', client);
		this.clients.delete(client);
	}

	public update() {
		setTimeout(() => {
			this.sync(true);
		}, 1000);

		setTimeout(() => {
			this.network.emit('test', {
				foo: 'ligma',
				bar: 69.42,
				baz: new Unit(this.world),
			});
		});
	}

	private sync(full = false): void {
		const { world, clients, network } = this;

		const payload = network.serialize();

		for (const client of clients) {
			console.log(`Sending snapshot to ${client.id}`);

			client.send('server:payload', payload);

			const snapshots = [...client.snapshots];
			const recent = snapshots.find((s) => s && s.acknowledged);

			const snapshot = new Snapshot();
			snapshot.type = full || !recent ? 'full' : 'partial';
			snapshot.entities = world.entities;

			client.send('server:snapshot', this.serializer.serialize(snapshot));
		}

		network.flush();
	}
}
