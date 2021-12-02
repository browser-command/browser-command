import { Schema, Serializable } from '../serialize';

import { Vector3 } from 'three';

declare module 'three/src/math/Vector3' {
	export interface Vector3 extends Serializable {
		schema(): Schema;
	}
}

Vector3.prototype.schema = function () {
	return {
		x: 'float32',
		y: 'float32',
		z: 'float32',
	};
};

export { Vector3 };
