import { Payload } from './Payload';
import { Event } from './Event';

import { Register } from '../collections';
import { Schema, Serializable, Serializer } from '../serialize';
import util from '../util';

export class Network {
	private serializer = new Serializer();
	private events = new Register<typeof Event>('events');
	private buffer: Event[] = [];

	public constructor() {
		this.serializer.register(Payload);
	}

	public register(name: string, schema: Schema) {
		if (this.events.has(name)) {
			throw new Error(`Event ${name} already registered`);
		}

		const event = class extends Event implements Serializable {
			get name() {
				return name;
			}

			schema(): Schema {
				return schema;
			}
		};

		this.serializer.register(event, util.hash(name));
		this.events.register(name, (payload) => new event(payload));
	}

	public write(name: string, payload: any) {
		if (!this.events.has(name)) {
			throw new Error(`Event ${name} is not registered`);
		}

		const event = this.events.create(name, payload);

		this.buffer.push(event);
	}

	public serialize() {
		if (this.buffer.length === 0) {
			return [];
		}

		const payload = new Payload();
		payload.events = this.buffer;

		return this.serializer.serialize(payload);
	}

	public flush() {
		this.buffer = [];
	}
}
