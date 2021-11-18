export class Pool<T> {
	private pool: T[];
	private readonly Func: Resettable<T>;

	constructor(Func: Resettable<T>) {
		this.pool = [];
		this.Func = Func;
	}

	get(): T {
		if (this.pool.length) {
			return this.pool.splice(0, 1)[0];
		}
		return new this.Func();
	}

	release(obj: T): void {
		if (this.Func.reset) {
			this.Func.reset(obj);
		}
		this.pool.push(obj);
	}
}

export interface Resettable<T> {
	// constructor
	new (): T;
	// static
	reset?(obj: T): void;
}
