export class RingBuffer<T> {
	private readonly _capacity: number;
	private _start: number;
	private _end: number;
	private _size: number;
	private readonly _buffer: (T | undefined)[];

	public readonly isArray = true;

	public constructor(iterable: Iterable<T>);
	public constructor(capacity: number);
	public constructor(iterableOrCapacity: Iterable<T> | number) {
		if (typeof iterableOrCapacity === 'number') {
			this._capacity = iterableOrCapacity;
			this._buffer = new Array(this._capacity);
		} else {
			const items = [...iterableOrCapacity];
			this._buffer = new Array(items.length);
			this._capacity = items.length;
			this.push(...iterableOrCapacity);
		}
		this._start = 0;
		this._end = 0;
		this._size = 0;
	}

	public push(...items: T[]): void {
		for (const item of items) {
			this._buffer[this._end] = item;
			this._end = (this._end + 1) % this._capacity;
			if (this._start === this._end) {
				this.incrementEnd();
			}
			this.incrementStart();
		}
	}

	public pop(): T | undefined {
		if (this._start === this._end) {
			this.decrementEnd();
		}
		this.decrementStart();
		const item = this._buffer[this._start];
		this._buffer[this._start] = undefined;
		return item;
	}

	public unshift(value: T | undefined): T | undefined {
		if (this._start === this._end) {
			this.decrementStart();
		}
		this.decrementEnd();
		const item = this._buffer[this._end];
		this._buffer[this._end] = value;
		return item;
	}

	public shift(): T | undefined {
		if (this._start === this._end) {
			this.incrementStart();
		}
		const item = this._buffer[this._end];
		this._buffer[this._end] = undefined;
		this.incrementEnd();
		return item;
	}

	public get(index = 0): T | undefined {
		return this._buffer[this.clamp(this._start - 1 - index)];
	}

	public peek(index = 0): T | undefined {
		return this._buffer[this.clamp(this._end + index)];
	}

	public clear(): void {
		this._start = 0;
		this._end = 0;
		this._size = 0;
		this._buffer.fill(undefined);
	}

	public *[Symbol.iterator]() {
		yield* this._buffer[Symbol.iterator]();
	}

	private incrementStart(): void {
		this._start = (this._start + 1) % this._capacity;
	}

	private incrementEnd(): void {
		this._end = (this._end + 1) % this._capacity;
	}

	private decrementStart(): void {
		this._start = (this._start - 1 + this._capacity) % this._capacity;
	}

	private decrementEnd(): void {
		this._end = (this._end - 1 + this._capacity) % this._capacity;
	}

	private clamp(index: number): number {
		const i = index % this._capacity;
		if (i < 0) {
			return i + this._capacity;
		}
		return i;
	}
}
