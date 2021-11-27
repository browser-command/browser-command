import { Strategy } from './Strategy';
import { Snapshot } from '@browser-command/core';

export class SyncStrategy extends Strategy {
	public apply(snapshot: Snapshot): boolean {
		this.initialized = true;

		const { world } = this.client;

		// for (const [id, entity] of world.entities) {
		// 	if (!snapshot.entities.has(entity.id)) {
		// 		world.entities.remove(entity);
		// 	}
		// }

		for (const [id, entity] of snapshot.entities) {
			if (world.entities.has(id)) {
				// world.entities;
			} else {
				// world.entities.add(entity.type, entity);
			}
		}

		return true;
	}
}
