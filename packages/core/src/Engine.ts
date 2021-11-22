import { EventEmitter2 } from 'eventemitter2';
import { World } from './World';

export class Engine extends EventEmitter2 {
	public readonly isServer: boolean;
	public world: World;

	public constructor() {
		super({
			wildcard: true,
			delimiter: ':',
			maxListeners: 1000,
		});

		this.world = new World();

		const isServer = typeof window === 'undefined';
		const globals = isServer ? global : window;

		(globals as Record<string, unknown>)['GAME'] = this;

		this.isServer = isServer;
	}

	public initialize(): void {}
}
