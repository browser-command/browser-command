import type { Client } from '../Client';

export class Synchronizer {
	private initialized = false;

	public constructor(private readonly client: Client) {
	}

	public collect(event: any) {
		if (!this.initialized) {
			if (event.type !== 'FULL') {
				return;
			}
		}
	}

	public update() {
	}
}
