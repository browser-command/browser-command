import { Engine } from '@browser-command/core';
import { Entity } from '@browser-command/core';

export abstract class Renderer {
	protected engine: Engine;

	protected constructor(engine: Engine) {
		this.engine = engine;
	}

	public update(): void {
		this.engine.emit('engine:draw');
	}

	public abstract add(entity: Entity): void;
	public abstract remove(entity: Entity): void;
}
