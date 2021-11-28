import { EventEmitter2 } from 'eventemitter2';

export class Register<K, T extends new (...args: any[]) => InstanceType<T>> extends EventEmitter2 {
	private _classes: Map<K, T> = new Map();

	public constructor(public readonly name: string) {
		super();
	}

	public register<R extends T>(id: K, cls: R): void {
		this._classes.set(id, cls);

		this.emit(`register`, id, cls);
	}

	public has(id: K): boolean {
		return this._classes.has(id);
	}

	public get<R extends T = T>(id: K): R | undefined {
		return this._classes.get(id) as R | undefined;
	}

	public create<R extends T = T>(id: K, ...args: ConstructorParameters<R>): InstanceType<R> {
		const cls = this._classes.get(id);
		if (!cls) {
			throw new Error(`Object class ${id} not found`);
		}
		const object = new cls(...args);
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
