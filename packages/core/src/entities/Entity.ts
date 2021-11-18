import { World } from '../world';

export abstract class Entity {
	public readonly id: string;

	protected constructor(private readonly world: World) {
		this.id = '';
	}

	public abstract update(dt: number): void;

	public destroy(): void {
		this.world.entities.destroy(this);
	}
}
