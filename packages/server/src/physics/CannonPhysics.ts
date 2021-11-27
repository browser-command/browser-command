import * as CANNON from 'cannon-es';

import { Entity } from '@browser-command/core';

import { Physics } from './Physics';

export class CannonPhysics extends Physics {
	private world = new CANNON.World();
	private entities = new Map<Entity, CANNON.Body>();

	update() {
		super.update();
		this.world.step(1 / 60);

		for (const [entity, body] of this.entities) {
			if (entity.model) entity.position = body.position;
			entity.rotation = body.quaternion;
		}
	}

	add(entity: Entity): void {
		if (this.entities.has(entity)) {
			return;
		}

		const body = new CANNON.Body({
			mass: 1,
			position: new CANNON.Vec3(entity.position.x, entity.position.y, entity.position.z),
			quaternion: new CANNON.Quaternion(
				entity.rotation.x,
				entity.rotation.y,
				entity.rotation.z,
				entity.rotation.w
			),
		});

		this.world.addBody(body);
		this.entities.set(entity, body);
	}

	remove(entity: Entity): void {
		if (!this.entities.has(entity)) {
			return;
		}

		const body = this.entities.get(entity);
		if (body) {
			this.world.removeBody(body);
		}

		this.entities.delete(entity);
	}
}
