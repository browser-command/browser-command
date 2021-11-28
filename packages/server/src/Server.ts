import socket from 'socket.io';
import { Datatype, Engine, Snapshot } from '@browser-command/core';

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

		const entity = this.entities.create('unit', this.world);
		entity.model = '/models/m1-ship1.obj';
		entity.spawn();
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

	public update() {
		this.sync(true);
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
