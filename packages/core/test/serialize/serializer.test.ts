/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Datatype, Serializable, Serializer } from '../../src';

class Primitive implements Serializable {
	public number = 0;

	public schema() {
		return {
			number: {
				type: Datatype.INT32,
			},
		};
	}
}

it('should throw if the class is not registered', () => {
	expect(() => {
		const serializer = new Serializer();
		serializer.serialize(new Primitive());
	}).toThrowError(`Unknown class: ${Primitive.name}`);
});

it('should throw if the class is missing a schema', () => {
	const serializer = new Serializer();

	class MissingSchema implements Serializable {
		schema() {
			return undefined!;
		}
	}

	serializer.register(MissingSchema);
	expect(() => {
		serializer.serialize(new MissingSchema());
	}).toThrowError(`Missing schema for class: ${MissingSchema.name}`);
});

it('should serialize a class with primitives', () => {
	const serializer = new Serializer();
	serializer.register(Primitive);

	const primitive = new Primitive();
	primitive.number = 1;

	const serialized = serializer.serialize(primitive);

	// [hash16 x 2, int32 x 4] == 6 bytes
	expect(serialized).toEqual([220, 54, 1, 0, 0, 0]);
});
