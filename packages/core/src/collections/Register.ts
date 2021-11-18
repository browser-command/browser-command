import { EventEmitter2 } from 'eventemitter2';

export class Register<T, U> extends EventEmitter2 {
	private objects: Set<T> = new Set();
	private classes: Map<string, new (owner: U) => T> = new Map();

	public constructor(protected readonly owner: U) {
		super();
	}

	public register(name: string, cls: new () => T): void {
		this.classes.set(name, cls);
		this.emit('register', name, cls);
	}

	public create(name: string): T {
		const cls = this.classes.get(name);
		if (!cls) {
			throw new Error(`Object class ${name} not found`);
		}
		const object = new cls(this.owner);
		this.objects.add(object);

		this.emit('create', object);

		return object;
	}

	public destroy(object: T): void {
		this.emit('destroy', object);

		this.objects.delete(object);
	}

	public get count(): number {
		return this.objects.size;
	}

	[Symbol.iterator]() {
		return this.objects[Symbol.iterator]();
	}
}
