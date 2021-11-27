export type Constructor<T = object> = (new (...args: any[]) => T) & { prototype: T };

export interface Vector3 {
	x: number;
	y: number;
	z: number;
}

export interface Quaternion {
	x: number;
	y: number;
	z: number;
	w: number;
}
