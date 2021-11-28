/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Datatype, SchemaType, Serializable, Serializer } from '../../src';

it('should throw if serializing a class which is not registered', () => {
	const serializer = new Serializer();

	class Unregistered implements Serializable {
		schema() {
			return {};
		}
	}

	expect(() => {
		serializer.serialize(new Unregistered());
	}).toThrowError(`Unknown class: ${Unregistered.name}`);
});

it('should throw if deserializing a class which is not registered', () => {
	const serializer = new Serializer();

	expect(() => {
		serializer.deserialize(Uint8Array.from([200, 68]));
	}).toThrowError(`Unknown class id: ${256 * 68 + 200}`);
});

it('should throw if serializing a class without a schema', () => {
	const serializer = new Serializer();

	class Test implements Serializable {
		schema() {
			return undefined!;
		}
	}

	serializer.register('test', Test);
	expect(() => {
		serializer.serialize(new Test());
	}).toThrowError(`Missing schema for class: 'test'`);
});

it('should serialize a class with floats', () => {
	const serializer = new Serializer();

	const Test = createSerializable(Datatype.FLOAT32);
	serializer.register('test', Test);

	const test = new Test();
	test.value = 0.5;

	const serialized = serializer.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 0, 0, 0, 63]));
});

it('should deserialize a class with floats', () => {
	const serializer = new Serializer();

	const Test = createSerializable(Datatype.FLOAT32);
	serializer.register('test', Test);

	const test = serializer.deserialize<InstanceType<typeof Test>>(
		Buffer.from([200, 68, 0, 0, 0, 63])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(0.5);
});

it('should serialize a class with integers', () => {
	const serializer = new Serializer();
	const Test = createSerializable(Datatype.INT32);
	serializer.register('test', Test);

	const test = new Test();
	test.value = 420;

	const serialized = serializer.serialize(test);

	expect(serialized).toEqual(Uint8Array.from([200, 68, 164, 1, 0, 0]));
});

it('should deserialize a class with integers', () => {
	const serializer = new Serializer();
	const Test = createSerializable(Datatype.INT32);
	serializer.register('test', Test);

	const test = serializer.deserialize<InstanceType<typeof Test>>(
		Uint8Array.from([200, 68, 164, 1, 0, 0])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(420);
});

it('should serialize a class with shorts', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.INT16);
	serialize.register('test', Test);

	const test = new Test();
	test.value = 69;

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 69, 0]));
});

it('should deserialize a class with shorts', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.INT16);
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(Buffer.from([200, 68, 69, 0]));
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(69);
});

it('should serialize a class with bytes', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.INT8);
	serialize.register('test', Test);

	const test = new Test();
	test.value = 69;

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 69]));
});

it('should deserialize a class with bytes', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.INT8);
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(Buffer.from([200, 68, 69]));
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(69);
});

it('should serialize a class with unsigned integers', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.UINT32);
	serialize.register('test', Test);

	const test = new Test();
	test.value = 102400;

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 0, 144, 1, 0]));
});

it('should deserialize a class with unsigned integers', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.UINT32);
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([200, 68, 0, 144, 1, 0])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(102400);
});

it('should serialize a class with unsigned shorts', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.UINT16);
	serialize.register('test', Test);

	const test = new Test();
	test.value = 25;

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 25, 0]));
});

it('should deserialize a class with unsigned shorts', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.UINT16);
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(Buffer.from([200, 68, 25, 0]));
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(25);
});

it('should serialize a class with unsigned bytes', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.UINT8);
	serialize.register('test', Test);

	const test = new Test();
	test.value = 25;

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 25]));
});

it('should serialize a class with a string', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.STRING);
	serialize.register('test', Test);

	const test = new Test();
	test.value = 'test';

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 4, 116, 101, 115, 116]));
});

it('should deserialize a class with a string', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.STRING);
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([200, 68, 4, 116, 101, 115, 116])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual('test');
});

it('should serialize a class with a class', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.CLASS);
	serialize.register('test', Test);

	const Value = createSerializable(Datatype.INT32);
	serialize.register('value', Value);

	const test = new Test();
	test.value = new Value();
	test.value.value = 420;

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(Uint8Array.from([200, 68, 29, 152, 164, 1, 0, 0]));
});

it('should deserialize a class with a class', () => {
	const serialize = new Serializer();

	const Test = createSerializable(Datatype.CLASS);
	serialize.register('test', Test);

	const Value = createSerializable(Datatype.INT32);
	serialize.register('value', Value);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([200, 68, 29, 152, 164, 1, 0, 0])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toBeInstanceOf(Value);
	expect(test.value.value).toEqual(420);
});

it('should serialize a class with a list', () => {
	const serialize = new Serializer();

	const Test = createSerializable({ type: Datatype.LIST, listType: Datatype.INT32 });
	serialize.register('test', Test);

	const test = new Test();
	test.value = [1, 2, 3];

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(
		Uint8Array.from([200, 68, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0])
	);
});

it('should deserialize a class with a list', () => {
	const serialize = new Serializer();

	const Test = createSerializable({ type: Datatype.LIST, listType: Datatype.INT32 });
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([200, 68, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual([1, 2, 3]);
});

it('should serialize a class with a map', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: Datatype.INT32,
	});
	serialize.register('test', Test);

	const test = new Test();
	test.value = new Map([
		[1, 2],
		[3, 4],
	]);

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(
		Uint8Array.from([200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0])
	);
});

it('should deserialize a class with a map', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: Datatype.INT32,
	});
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(
		new Map([
			[1, 2],
			[3, 4],
		])
	);
});

it('should serialize a class with a map with a list', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: { type: Datatype.LIST, listType: Datatype.INT32 },
	});
	serialize.register('test', Test);

	const test = new Test();
	test.value = new Map([
		[1, [2, 3]],
		[4, [5, 6]],
	]);

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(
		Uint8Array.from([
			200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0,
			5, 0, 0, 0, 6, 0, 0, 0,
		])
	);
});

it('should deserialize a class with a map with a list', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: { type: Datatype.LIST, listType: Datatype.INT32 },
	});
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([
			200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0,
			5, 0, 0, 0, 6, 0, 0, 0,
		])
	);
	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(
		new Map([
			[1, [2, 3]],
			[4, [5, 6]],
		])
	);
});

it('should serialize a class with a map with a map', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: {
			type: Datatype.MAP,
			mapKeyType: Datatype.INT32,
			mapValueType: Datatype.INT32,
		},
	});
	serialize.register('test', Test);

	const test = new Test();
	test.value = new Map([
		[1, new Map([[2, 3]])],
		[4, new Map([[5, 6]])],
	]);

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(
		Uint8Array.from([
			200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0,
			5, 0, 0, 0, 6, 0, 0, 0,
		])
	);
});

it('should deserialize a class with a map with a map', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: {
			type: Datatype.MAP,
			mapKeyType: Datatype.INT32,
			mapValueType: Datatype.INT32,
		},
	});
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([
			200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0,
			5, 0, 0, 0, 6, 0, 0, 0,
		])
	);

	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(
		new Map([
			[1, new Map([[2, 3]])],
			[4, new Map([[5, 6]])],
		])
	);
});

it('should serialize a class with a map with a map with a list', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: {
			type: Datatype.MAP,
			mapKeyType: Datatype.INT32,
			mapValueType: {
				type: Datatype.LIST,
				listType: Datatype.INT32,
			},
		},
	});
	serialize.register('test', Test);

	const test = new Test();
	test.value = new Map([
		[1, new Map([[2, [3]]])],
		[4, new Map([[5, [6]]])],
	]);

	const serialized = serialize.serialize(test);
	expect(serialized).toEqual(
		Uint8Array.from([
			200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0,
			1, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0,
		])
	);
});

it('should deserialize a class with a map with a map with a list', () => {
	const serialize = new Serializer();

	const Test = createSerializable({
		type: Datatype.MAP,
		mapKeyType: Datatype.INT32,
		mapValueType: {
			type: Datatype.MAP,
			mapKeyType: Datatype.INT32,
			mapValueType: {
				type: Datatype.LIST,
				listType: Datatype.INT32,
			},
		},
	});
	serialize.register('test', Test);

	const test = serialize.deserialize<InstanceType<typeof Test>>(
		Buffer.from([
			200, 68, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0,
			1, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0,
		])
	);

	expect(test).toBeInstanceOf(Test);
	expect(test.value).toEqual(
		new Map([
			[1, new Map([[2, [3]]])],
			[4, new Map([[5, [6]]])],
		])
	);
});

function createSerializable(type: SchemaType | Datatype) {
	return class Test implements Serializable {
		public value!: any;

		schema() {
			return {
				value: typeof type === 'string' ? { type } : type,
			};
		}
	};
}
