import { World } from '../World';
import { Entity } from '../entities';
import { IterableWeakMap } from '../collections';

export abstract class System<T = unknown> {
	public readonly id: string;
	public readonly entities: IterableWeakMap<Entity, T>;

	public constructor(private readonly world: World) {
		this.id = this.constructor.name;
		this.entities = new IterableWeakMap();
	}

	/**
	 * Adds an entity to the system.
	 * @note Subclasses which override this method must call `super.add(entity)`.
	 * @param {Entity} entity
	 * @param data
	 */
	public add(entity: Entity, data?: T): void {
		this.entities.set(entity, data ?? ({} as T));
	}

	/**
	 * Retrieve the entity's data from the system.
	 * @param entity
	 */
	public get(entity: Entity): T | null {
		return this.entities.get(entity) ?? null;
	}

	/**
	 * Called by the world to update the system.
	 * @param entity
	 * @param delta
	 */
	public abstract update(entity: Entity, delta: number): void;

	public destroy(): void {
	}
}
