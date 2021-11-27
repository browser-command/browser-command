import { EventEmitter2 } from 'eventemitter2';

import { Register } from '../collections';
import { Schema, Serializer } from '../serialize';

import { Event } from './Event';
import { Snapshot } from './Snapshot';
import { Payload } from './Payload';

export class Network extends EventEmitter2 {
	private events = new Register<string, typeof Event>('events');
	private buffer: Event[] = [];

	public constructor(private serializer = new Serializer()) {
		super({
			wildcard: true,
			delimiter: ':',
			maxListeners: 100,
		});

		this.serializer.register('server:snapshot', Snapshot);
		this.serializer.register('server:payload', Payload);

		this.onAny((name, payload) => {
			if (typeof name !== 'string') {
				throw new Error('Event name must be a string');
			}

			if (!this.events.has(name)) {
				throw new Error(`Event ${name} is not registered`);
			}

			const event = this.events.create(name, payload);

			this.buffer.push(event);
		});
	}

	public register<T extends Event<T>>(name: string, schema: Schema) {
		if (this.events.has(name)) {
			throw new Error(`Event ${name} already registered`);
		}

		const event = class Custom extends Event<Custom> {
			schema() {
				return schema;
			}
		};

		this.serializer.register(name, event);
		this.events.register(name, (payload) => new event(payload));
	}

	public serialize() {
		if (this.buffer.length === 0) {
			return new Uint8Array(0);
		}

		const payload = new Payload();
		payload.events = this.buffer;

		return this.serializer.serialize(payload);
	}

	public deserialize(payload: Buffer): Payload {
		return this.serializer.deserialize(payload);
	}

	public flush() {
		this.buffer = [];
	}
}
