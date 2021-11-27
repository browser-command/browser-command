import { EventEmitter2 } from 'eventemitter2';

export class Register<K, T extends new (...args: any[]) => InstanceType<T>> extends EventEmitter2 {
	private _classes: Map<K, (...args: ConstructorParameters<T>) => InstanceType<T>> = new Map();

	public constructor(public readonly name: string) {
		super();
	}

	public register<R extends T>(
		id: K,
		factory: (...args: ConstructorParameters<R>) => InstanceType<R>
	): void {
		this._classes.set(id, factory);

		this.emit(`register`, id, factory);
	}

	public has(id: K): boolean {
		return this._classes.has(id);
	}

	public get<R extends T = T>(
		id: K
	): ((...args: ConstructorParameters<R>) => InstanceType<R>) | undefined {
		return this._classes.get(id);
	}

	public create<R extends T = T>(id: K, ...args: ConstructorParameters<R>): InstanceType<R> {
		const factory = this._classes.get(id);
		if (!factory) {
			throw new Error(`Object class ${id} not found`);
		}
		const object = factory(...args);
		Object.assign(object, { _type: id });

		this.emit(`create`, object);

		return object as InstanceType<R>;
	}

	public get count(): number {
		return this._classes.size;
	}

	[Symbol.iterator]() {
		return this._classes[Symbol.iterator]();
	}
}
