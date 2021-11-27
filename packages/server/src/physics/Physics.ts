import { Engine, Entity } from '@browser-command/core';

export abstract class Physics {
	protected engine: Engine;

	protected constructor(engine: Engine) {
		this.engine = engine;
	}

	public update(): void {
		this.engine.emit('engine:physics');
	}

	public abstract add(entity: Entity): void;
	public abstract remove(entity: Entity): void;
}
