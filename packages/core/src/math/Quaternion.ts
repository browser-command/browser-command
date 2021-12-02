import { Schema, Serializable } from '../serialize';

import { Quaternion } from 'three';

declare module 'three/src/math/Quaternion' {
	export interface Quaternion extends Serializable {
		schema(): Schema;
	}
}

Quaternion.prototype.schema = function () {
	return {
		x: 'float32',
		y: 'float32',
		z: 'float32',
		w: 'float32',
	};
};

export { Quaternion };
