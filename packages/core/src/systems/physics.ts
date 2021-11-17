import { System, IWorld, defineQuery, enterQuery } from 'bitecs';
import { Position, Quaternion } from '../components';
import { World } from '@dimforge/rapier3d';

const simulation = new World({ x: 0.0, y: -9.81, z: 0.0 });

const physicsQuery = defineQuery([Position, Quaternion]);
const enteredPhysicsQuery = enterQuery(physicsQuery);

export const physicsSystem: System = (world: IWorld) => {
	const entities = physicsQuery(world);

	for (const ent of entities) {
		Position.x[ent] += 1;
	}

	simulation.step();

	return world;
};
