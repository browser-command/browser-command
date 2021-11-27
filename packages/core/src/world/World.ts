import { Entity } from '../entities';
import { Datatype, Serializable } from '../serialize';

export class World implements Serializable {
	public static readonly version = '0.0.0';

	public readonly entities: Map<string, Entity> = new Map();

	public get version(): string {
		return World.version;
	}

	public schema() {
		return {
			entities: {
				type: Datatype.MAP,
				mapKeyType: Datatype.STRING,
				mapValueType: Datatype.CLASS,
			},
		};
	}
}
