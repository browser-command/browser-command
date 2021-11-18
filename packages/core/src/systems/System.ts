import { World } from '../world';

export abstract class System {
	public readonly id: string;

	protected constructor(private readonly world: World) {
		this.id = this.constructor.name;
	}

	public abstract update(delta: number): void;

	public destroy(): void {
		this.world.systems.destroy(this);
	}
}
