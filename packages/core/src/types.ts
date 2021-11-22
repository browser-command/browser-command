export interface IComparable<T> {
	equals(other: T): boolean;
}

export type Constructor<T = object> = (new (...args: any[]) => T) & { prototype: T };
