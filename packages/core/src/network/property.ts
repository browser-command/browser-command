import 'reflect-metadata';
import { parent } from './serializable';

const PROPERTY_KEY = Symbol('property');
const INSTANCE_PROPERTY_KEY = Symbol('instanceProperty');

type PrimitiveConstructor = StringConstructor | NumberConstructor | BooleanConstructor;

type Constructor<T = object> = (new (...args: any[]) => T) & { prototype: T };

interface PropertyMetadata {
	type: Constructor | PrimitiveConstructor;
	isArray: boolean;
}

export function property(cls?: Constructor | PrimitiveConstructor): PropertyDecorator {
	return (target, key) => {
		if (typeof key === 'symbol') {
			throw new Error('Property decorator can only be used on class properties');
		}

		// Ensure we are attaching metadata to the constructor, not prototype
		const constructor = target instanceof Function ? target : target.constructor;

		// Retrieve the reflected type metadata
		const type = Reflect.getMetadata('design:type', target, key);

		if (type === Array && !cls) {
			throw new Error(`Property ${key} is an array, but no type was specified`);
		}

		// Retrieve existing metadata or create a new one
		const properties: Map<string, PropertyMetadata> =
			Reflect.getMetadata(PROPERTY_KEY, constructor) ?? new Map();

		properties.set(key, {
			type: cls ?? type,
			isArray: type === Array,
		});

		Reflect.defineProperty(target, key, {
			set(this: any, value: any) {
				if (!(this[INSTANCE_PROPERTY_KEY] instanceof Map)) {
					this[INSTANCE_PROPERTY_KEY] = new Map();
				}

				const previous = this[INSTANCE_PROPERTY_KEY].get(key) ?? { value: undefined, dirty: false };
				const next = { ...previous };

				const metadata = properties.get(key);

				if (!metadata) {
					throw new Error(`Property metadata for '${key}' does not exist`);
				}

				// Check if the property changed and mark it dirty
				if (metadata.isArray) {
					if (!Array.isArray(value)) {
						throw new Error(`Property '${key}' is an array, but the value is not an array`);
					}

					if (value.length !== previous.value.length) {
						next.dirty = true;
					} else {
						for (let i = 0; i < value.length; i++) {
							if (value[i] !== previous.value[i]) {
								next.dirty = true;
								break;
							}
						}
					}
				} else {
					if (value !== previous.value) {
						next.dirty = true;
					}
				}

				if (next.dirty) {
					next.value = value;
				}

				this[INSTANCE_PROPERTY_KEY].set(key, next);
			},
		});

		// Store the metadata on the constructor
		Reflect.defineMetadata(PROPERTY_KEY, properties, constructor);
	};
}

export function properties<T>(cls: T | Constructor<T>): Map<string, PropertyMetadata> {
	const constructor: Constructor<T> =
		cls instanceof Function ? cls : Object.getPrototypeOf(cls).constructor;

	if (!Reflect.hasOwnMetadata(PROPERTY_KEY, constructor)) {
		return new Map();
	}

	const base = parent(constructor);

	if (base && Reflect.hasOwnMetadata(PROPERTY_KEY, base)) {
		return new Map([...Reflect.getMetadata(PROPERTY_KEY, constructor), ...properties(base)]);
	}

	return new Map([...Reflect.getMetadata(PROPERTY_KEY, constructor)]);
}
