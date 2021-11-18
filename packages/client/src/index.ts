import { World } from '@browser-command/core';

export class Client {
	public world: World = new World();

	public constructor() {}

	public update(delta: number): void {
		this.world.update(delta);
	}
}
