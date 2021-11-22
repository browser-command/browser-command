import 'reflect-metadata';

const SERIALIZABLE_KEY = Symbol('serializable');

type Constructor<T = object> = (new (...args: any[]) => T) & { prototype: T };

export function serializable(options?: any) {
	return (target: Constructor) => {
		const base = parent(target);

		if (base) {
			if (!Reflect.hasOwnMetadata(SERIALIZABLE_KEY, base)) {
				throw new Error(`Base class '${base.name}' is not serializable`);
			}
		}

		Reflect.defineProperty(target, 'serialize', {});

		Reflect.defineMetadata(SERIALIZABLE_KEY, options || {}, target);
	};
}

export function parent<T>(target?: Constructor<T>): Constructor | undefined {
	if (!target) return undefined;

	const base = Object.getPrototypeOf(target.prototype.constructor);

	return typeof base.prototype !== 'undefined' ? base : undefined;
}
