import { Schema, Serializable } from '../serialize';

export class Event<T extends Event<T> = any> implements Serializable {
	public constructor(payload: { [K in keyof T]: T[K] }) {
		Object.assign(this, payload);
	}

	public schema(): Schema {
		return {};
	}
}
