export class IterableWeakMap<K extends object, V> {
	static [Symbol.species] = IterableWeakMap;

	private finalizationRegistry = new FinalizationRegistry<WeakRef<K>>(this.cleanup.bind(this));

	private toValueMap: Map<WeakRef<K>, V> = new Map();

	private toRefWeakMap: WeakMap<K, WeakRef<K>> = new WeakMap();

	constructor(iterable: Iterable<readonly [K, V]>);
	constructor(values?: readonly (readonly [K, V])[]);
	constructor(iterable: Iterable<readonly [K, V]> | readonly (readonly [K, V])[] = []) {
		for (const [key, value] of iterable) this.set(key, value);
	}

	private cleanup(ref: WeakRef<K>) {
		this.toValueMap.delete(ref);
	}

	get size() {
		return this.toValueMap.size;
	}

	clear() {
		for (const value of this.keys()) this.delete(value);
	}

	delete(key: K | undefined) {
		if (!key) return false;
		const ref = this.toRefWeakMap.get(key);
		if (!ref) return false;
		this.toValueMap.delete(ref);
		this.toRefWeakMap.delete(key);
		this.finalizationRegistry.unregister(ref);
		return true;
	}

	*entries(): IterableIterator<[K | undefined, V | undefined]> {
		for (const ref of this.toValueMap.keys()) yield [ref.deref(), this.toValueMap.get(ref)];
	}

	forEach(callback: (value: V | undefined, key: K | undefined, map: this) => void, thisArg?: any) {
		for (const [key, value] of this.entries()) callback.call(thisArg, value, key, this);
	}

	get(key: K) {
		const ref = this.toRefWeakMap.get(key);
		if (!ref) return;
		return this.toValueMap.get(ref);
	}

	has(key: K) {
		return this.toRefWeakMap.has(key);
	}

	*keys() {
		for (const ref of this.toValueMap.keys()) {
			yield ref.deref();
		}
	}

	set(key: K, value: V) {
		if (this.has(key)) this.delete(key);
		const ref = new WeakRef(key);
		this.toValueMap.set(ref, value);
		this.toRefWeakMap.set(key, ref);
		this.finalizationRegistry.register(key, ref, ref);
		return this;
	}

	values() {
		return this.toValueMap.values();
	}
}

export interface IterableWeakMap<K extends object, V> {
	[Symbol.iterator](): IterableIterator<[K, V]>;
}

IterableWeakMap.prototype[Symbol.iterator] = IterableWeakMap.prototype.entries;
