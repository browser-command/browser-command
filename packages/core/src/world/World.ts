import { Entity } from '../entities';
import { Datatype, Serializable } from '../serialize';

export class World implements Serializable {
	public static readonly version = '0.0.0';

	public readonly entities: Map<string, Entity> = new Map();

	public get version(): string {
		return World.version;
	}

	public has(entity: Entity): boolean;
	public has(id: string): boolean;
	public has(entityOrId: Entity | string): boolean {
		if (typeof entityOrId === 'string') {
			return this.entities.has(entityOrId);
		}
		return this.entities.has(entityOrId.id);
	}

	public get(id: string): Entity | undefined {
		return this.entities.get(id);
	}

	public add(entity: Entity): void {
		if (this.entities.has(entity.id)) {
			return;
		}

		this.entities.set(entity.id, entity);
	}

	public remove(entity: Entity): void {
		if (!this.entities.has(entity.id)) {
			return;
		}

		this.entities.delete(entity.id);
	}

	public schema() {
		return {
			entities: {
				type: Datatype.MAP,
				mapKeyType: Datatype.STRING,
				mapValueType: Datatype.CLASS,
			},
		};
	}
}
