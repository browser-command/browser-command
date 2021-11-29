import { Datatype, Schema, Serializable } from '../serialize';

import { Vector3 } from 'three';

declare module 'three/src/math/Vector3' {
	export interface Vector3 extends Serializable {
		schema(): Schema;
	}
}

Vector3.prototype.schema = function () {
	return {
		x: { type: Datatype.FLOAT32 },
		y: { type: Datatype.FLOAT32 },
		z: { type: Datatype.FLOAT32 },
	};
};

export { Vector3 };
