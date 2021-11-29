import { Strategy } from './Strategy';
import { Entity, Snapshot } from '@browser-command/core';

export class SyncStrategy extends Strategy {
	public apply(snapshot: Snapshot): boolean {
		this.initialized = true;

		const { world } = this.client;

		for (const [id, entity] of world.entities) {
			if (!snapshot.entities.has(id)) {
				entity.destroy();
			}
		}

		for (const [id, entity] of snapshot.entities) {
			const schema = entity.schema();
			const existing = world.get(id) ?? this.client.create(entity.type);

			type SchemaKey = keyof typeof schema;

			for (const key of Object.keys(schema) as SchemaKey[]) {
				(existing as Record<SchemaKey, Entity[SchemaKey]>)[key] = entity[key];
			}

			if (!world.has(id)) {
				existing.spawn();
			}
		}

		return true;
	}
}
