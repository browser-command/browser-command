import { Engine } from '../Engine';
import { Entity } from '../entities';

export abstract class Renderer {
	private engine: Engine;

	protected constructor(engine: Engine) {
		this.engine = engine;
	}

	public update(): void {
		this.engine.emit('engine:draw');
	}

	public abstract add(entity: Entity): void;
	public abstract remove(entity: Entity): void;
}
