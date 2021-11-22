import { Register } from '../collections';
import { Constructor } from '../types';
import { BinaryReader } from 'csharp-binary-stream';

enum TYPES {
	FLOAT32 = 'float32',

	INT32 = 'int32',
	INT16 = 'int16',
	INT8 = 'int8',

	UINT32 = 'uint32',
	UINT16 = 'uint16',
	UINT8 = 'uint8',

	LIST = 'list',
	CLASS = 'class',
}

export class Serializer {
	public static readonly TYPES = TYPES;

	private classes: Register<Constructor, number> = new Register('classes');

	public constructor() {}

	public register(id: number, type: Constructor): void {
		this.classes.register(id, () => new type());
	}

	public deserialize(data: Buffer, position: number);
	public deserialize(data: BinaryReader, position: number);
	public deserialize(data: Buffer | BinaryReader, position = 0) {
		const reader = data instanceof Buffer ? new BinaryReader(data) : data;
		reader.position = position;

		const id = reader.readByte();

		if (!this.classes.has(id)) {
			throw new Error(`Unknown class: ${id}`);
		}

		const instance: any = this.classes.get(id)?.();

		if (!instance) {
			throw new Error(`Unknown class: ${id}`);
		}

		for (const property of Object.keys(instance.schema).sort()) {
			this.read(reader, instance.schema[property]);
		}

		return { instance };
	}

	public read(reader: BinaryReader, schema: any) {
		const { type } = schema;

		let data: unknown = null;

		if (type === Serializer.TYPES.FLOAT32) {
			data = reader.readFloat();
		} else if (type === Serializer.TYPES.INT32) {
			data = reader.readInt();
		} else if (type === Serializer.TYPES.INT16) {
			data = reader.readShort();
		} else if (type === Serializer.TYPES.INT8) {
			data = reader.readSignedByte();
		} else if (type === Serializer.TYPES.UINT32) {
			data = reader.readUnsignedInt();
		} else if (type === Serializer.TYPES.UINT16) {
			data = reader.readUnsignedShort();
		} else if (type === Serializer.TYPES.UINT8) {
			data = reader.readByte();
		} else if (type === Serializer.TYPES.LIST) {
			const items = [];

			const length = reader.readUnsignedShort();

			for (let i = 0; i < length; i++) {
				items.push(this.read(reader, schema.listType));
			}

			data = items;
		} else if (type === Serializer.TYPES.CLASS) {
			data = this.deserialize(reader, reader.position);
		}

		return data;
	}
}
