import { Entities, Systems } from './managers';
import { EventEmitter2 } from 'eventemitter2';

export class World extends EventEmitter2 {
	public static readonly version = '0.0.0';

	public readonly entities = new Entities(this);
	public readonly systems = new Systems(this);

	public constructor() {
		super({
			wildcard: true,
			delimiter: ':',
			maxListeners: 1000,
		});

		this.entities.on('create', (entity) => {
			this.emit('entity:create', entity);
		});

		this.entities.on('destroy', (entity) => {
			this.emit('entity:destroy', entity);
		});
	}

	public get version(): string {
		return World.version;
	}

	public update(delta: number): void {
		for (const system of this.systems) {
			system.update(delta);
		}

		for (const entity of this.entities) {
			entity.update(delta);
		}

		this.emit('update', delta);
	}
}
