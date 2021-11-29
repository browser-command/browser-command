import { Datatype, Schema, Serializable } from '../serialize';

import { Quaternion } from 'three';

declare module 'three/src/math/Quaternion' {
	export interface Quaternion extends Serializable {
		schema(): Schema;
	}
}

Quaternion.prototype.schema = function () {
	return {
		x: { type: Datatype.FLOAT32 },
		y: { type: Datatype.FLOAT32 },
		z: { type: Datatype.FLOAT32 },
		w: { type: Datatype.FLOAT32 },
	};
};

export { Quaternion };
