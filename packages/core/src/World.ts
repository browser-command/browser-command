import { EventEmitter2 } from 'eventemitter2';
import { Entity } from './entities';

export class World extends EventEmitter2 {
	public entities: Map<string, Entity> = new Map();

	public static readonly version = '0.0.0';

	public constructor() {
		super({
			wildcard: true,
			delimiter: ':',
			maxListeners: 1000,
		});
	}

	public add(entity: Entity): void {}

	public get version(): string {
		return World.version;
	}
}
