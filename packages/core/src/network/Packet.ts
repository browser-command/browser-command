import { BinaryReader, BinaryWriter, Encoding } from 'csharp-binary-stream';

export class Packet {
	private readonly data: Uint8Array;
	private readonly writer: BinaryWriter;
	private readonly reader: BinaryReader;

	public constructor(buffer?: ArrayBufferLike) {
		if (buffer) {
			this.data = new Uint8Array(buffer);
		} else {
			this.data = new Uint8Array(1024);
		}

		this.reader = new BinaryReader(this.data);
		this.writer = new BinaryWriter(this.data);
	}

	public toUint8Array() {
		return this.writer.toUint8Array();
	}

	public writeByte(value: number): void {
		this.writer.writeByte(value);
	}

	public readByte(): number {
		return this.reader.readByte();
	}

	public writeBytes(value: number[]): void {
		this.writer.writeBytes(value);
	}

	public readBytes(length: number): number[] {
		return this.reader.readBytes(length);
	}

	public writeString(value: string): void {
		this.writer.writeString(value, Encoding.Utf8);
	}

	public readString(): string {
		return this.reader.readString(Encoding.Utf8);
	}

	public writeUnsignedShort(value: number): void {
		this.writer.writeUnsignedShort(value);
	}

	public readUnsignedShort(): number {
		return this.reader.readUnsignedShort();
	}

	public writeUnsignedInt(value: number): void {
		this.writer.writeUnsignedInt(value);
	}

	public readUnsignedInt(): number {
		return this.reader.readUnsignedInt();
	}

	public writeUnsignedLong(value: number): void {
		this.writer.writeUnsignedLong(value);
	}

	public readUnsignedLong(): number {
		return this.reader.readUnsignedLong();
	}

	public writeShort(value: number): void {
		this.writer.writeShort(value);
	}

	public readShort(): number {
		return this.reader.readShort();
	}

	public writeInt(value: number): void {
		this.writer.writeInt(value);
	}

	public readInt(): number {
		return this.reader.readInt();
	}

	public writeLong(value: number): void {
		this.writer.writeLong(value);
	}

	public readLong(): number {
		return this.reader.readLong();
	}

	public writeFloat(value: number): void {
		this.writer.writeFloat(value);
	}

	public readFloat(): number {
		return this.reader.readFloat();
	}

	public writeDouble(value: number): void {
		this.writer.writeDouble(value);
	}

	public readDouble(): number {
		return this.reader.readDouble();
	}

	public writeBoolean(value: boolean): void {
		this.writer.writeBoolean(value);
	}

	public readBoolean(): boolean {
		return this.reader.readBoolean();
	}
}
