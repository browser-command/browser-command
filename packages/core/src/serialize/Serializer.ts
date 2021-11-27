import { BinaryReader, BinaryWriter, Encoding } from 'csharp-binary-stream';

import { Register } from '../collections';
import { Constructor } from '../types';

import { Serializable } from './Serializable';
import { SchemaType } from './Schema';

export enum Datatype {
	BOOL = 'bool',

	FLOAT32 = 'float32',

	INT32 = 'int32',
	INT16 = 'int16',
	INT8 = 'int8',

	UINT32 = 'uint32',
	UINT16 = 'uint16',
	UINT8 = 'uint8',

	STRING = 'string',
	LIST = 'list',
	MAP = 'map',
	CLASS = 'class',
}

export class Serializer {
	public static readonly TYPES = Datatype;

	private classes: Register<number, Constructor<Serializable>> = new Register('classes');
	private idMap: Map<Constructor, number> = new Map();

	public register<T extends Serializable>(id: string, type: Constructor<T>): void {
		const hash = this.hash(id);
		this.classes.register(hash, () => new type());
		this.idMap.set(type, hash);
	}

	public deserialize<T = unknown>(data: ArrayBuffer, position?: number): T;
	public deserialize<T = unknown>(data: BinaryReader): T;
	public deserialize<T = unknown>(data: ArrayBuffer | BinaryReader, position = 0): T {
		const reader = data instanceof ArrayBuffer ? new BinaryReader(data) : data;

		if (data instanceof ArrayBuffer) {
			reader.position = position;
		}

		const id = reader.readUnsignedShort();

		if (!this.classes.has(id)) {
			throw new Error(`Unknown class id: ${id}`);
		}

		const instance = this.classes.create(id);

		const schema = instance.schema();

		if (!schema) {
			throw new Error(`Unknown schema: ${id}`);
		}

		for (const property of Object.keys(schema).sort()) {
			instance[property] = this.read(reader, schema[property]);
		}

		return instance as unknown as T;
	}

	public serialize(instance: Serializable, writer = new BinaryWriter()): Uint8Array {
		const id = this.idMap.get(instance.constructor as Constructor);

		if (id === undefined) {
			throw new Error(`Unknown class: ${instance.constructor.name}`);
		}

		const schema = instance.schema();

		if (!schema) {
			throw new Error(`Missing schema for class: ${instance.constructor.name}`);
		}

		writer.writeUnsignedShort(id);

		for (const property of Object.keys(schema).sort()) {
			this.write(writer, instance[property], schema[property]);
		}

		return writer.toUint8Array();
	}

	public read(reader: BinaryReader, schema: SchemaType | Datatype) {
		const type = typeof schema === 'string' ? schema : schema.type;

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
			if (typeof schema === 'string') {
				throw new Error(`Unknown type: ${type}`);
			}

			if (!('listType' in schema && schema.listType)) {
				throw new Error(`Unknown type: ${type}`);
			}

			const items = [];

			const length = reader.readUnsignedInt();

			for (let i = 0; i < length; i++) {
				items.push(this.read(reader, schema.listType));
			}

			data = items;
		} else if (type === Serializer.TYPES.MAP) {
			if (typeof schema === 'string') {
				throw new Error(`Unknown type: ${type}`);
			}

			if (!('mapKeyType' in schema && schema.mapKeyType) || !schema.mapValueType) {
				throw new Error(`Unknown type: ${type}`);
			}

			const items = new Map();

			const length = reader.readUnsignedInt();

			for (let i = 0; i < length; i++) {
				const key = this.read(reader, schema.mapKeyType);
				const value = this.read(reader, schema.mapValueType);

				items.set(key, value);
			}

			data = items;
		} else if (type === Serializer.TYPES.CLASS) {
			data = this.deserialize(reader);
		} else if (type === Serializer.TYPES.STRING) {
			data = reader.readString(Encoding.Utf8);
		} else {
			throw new Error(`Unknown type: ${type}`);
		}

		return data;
	}

	public write(writer: BinaryWriter, value: unknown, schema: SchemaType | Datatype) {
		const type = typeof schema === 'string' ? schema : schema.type;

		if (type === Serializer.TYPES.FLOAT32) {
			writer.writeFloat(value as number);
		} else if (type === Serializer.TYPES.INT32) {
			writer.writeInt(value as number);
		} else if (type === Serializer.TYPES.INT16) {
			writer.writeShort(value as number);
		} else if (type === Serializer.TYPES.INT8) {
			writer.writeSignedByte(value as number);
		} else if (type === Serializer.TYPES.UINT32) {
			writer.writeUnsignedInt(value as number);
		} else if (type === Serializer.TYPES.UINT16) {
			writer.writeUnsignedShort(value as number);
		} else if (type === Serializer.TYPES.UINT8) {
			writer.writeByte(value as number);
		} else if (type === Serializer.TYPES.LIST) {
			if (typeof schema === 'string') {
				throw new Error(`Unknown type: ${type}`);
			}

			if (!('listType' in schema && schema.listType)) {
				throw new Error(`Unknown type: ${type}`);
			}

			const items = value as unknown[];

			writer.writeUnsignedInt(items.length);

			for (const item of items) {
				this.write(writer, item, schema.listType);
			}
		} else if (type === Serializer.TYPES.MAP) {
			if (typeof schema === 'string') {
				throw new Error(`Unknown type: ${type}`);
			}

			if (!('mapKeyType' in schema && schema.mapKeyType) || !schema.mapValueType) {
				throw new Error(`Unknown type: ${type}`);
			}

			const items = value as Map<unknown, unknown>;

			writer.writeUnsignedInt(items.size);

			for (const [key, value] of items) {
				this.write(writer, key, schema.mapKeyType);
				this.write(writer, value, schema.mapValueType);
			}
		} else if (type === Serializer.TYPES.CLASS) {
			writer.writeBytes([...this.serialize(value as Serializable)]);
		} else if (type === Serializer.TYPES.STRING) {
			writer.writeString(value as string, Encoding.Utf8);
		} else {
			throw new Error(`Unknown type: ${type}`);
		}
	}

	private hash(value: string, bits = 16): number {
		let hash = 0;
		if (value.length == 0) return hash;
		for (let i = 0; i < value.length; i++) {
			const char = value.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit integer
		}

		hash = hash >>> 0;
		hash = hash % (Math.pow(2, bits) - 1);

		return hash;
	}
}
