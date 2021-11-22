import { EventEmitter2 } from 'eventemitter2';

export type Typed<N> = { type: N };

export class Register<
	T extends
		| (new (...args: any[]) => InstanceType<T>)
		| (abstract new (...args: any[]) => InstanceType<T>),
	K = string
> extends EventEmitter2 {
	#objects: Set<InstanceType<T>> = new Set();
	#classes: Map<K, (...args: ConstructorParameters<T>) => InstanceType<T>> = new Map();
	#instances: Map<K, Set<InstanceType<T>>> = new Map();

	public constructor(public readonly name: string) {
		super();
	}

	public register<R extends T>(
		id: K,
		factory: (...args: ConstructorParameters<R>) => InstanceType<R>
	): void {
		this.#classes.set(id, factory);

		this.emit(`${this.name}:register`, id, factory);
	}

	public has(id: K): boolean {
		return this.#classes.has(id);
	}

	public get<R extends T = T>(
		id: K
	): ((...args: ConstructorParameters<R>) => InstanceType<R>) | undefined {
		return this.#classes.get(id);
	}

	public create<R extends T = T>(
		id: K,
		...args: ConstructorParameters<R>
	): InstanceType<R> & Typed<typeof id> {
		const factory = this.#classes.get(id);
		if (!factory) {
			throw new Error(`Object class ${id} not found`);
		}
		const object = factory(...args);
		Object.assign(object, { _type: id });
		this.#objects.add(object);

		this.emit(`${this.name}:create`, object);

		return object as InstanceType<R>;
	}

	public destroy(object: InstanceType<T>): void {
		this.emit(`${this.name}:destroy`, object);

		this.#objects.delete(object);
	}

	public instances<R extends T = T, N extends K = K>(id: N): Set<InstanceType<R> & Typed<N>>;
	public instances<R extends T = T>(): Set<InstanceType<R> & Typed<K>>;
	public instances<R extends T = T, N extends K = K>(
		id?: K
	): Set<InstanceType<R> & Typed<typeof id extends K ? N : K>> {
		if (id) {
			const instances = this.#instances.get(id);
			if (!instances) {
				throw new Error(`Object instances ${id} not found`);
			}
			return instances;
		}
		return this.#objects;
	}

	public get count(): number {
		return this.#objects.size;
	}

	[Symbol.iterator]() {
		return this.#objects[Symbol.iterator]();
	}
}
