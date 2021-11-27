import { Datatype, Schema, Serializable } from '../serialize';
import { Entity } from '../entities';

export class Snapshot implements Serializable {
	public type: 'full' | 'partial' = 'full';
	public step = 0;
	public entities = new Map<string, Entity>();

	public acknowledged = false;

	schema(): Schema {
		return {
			type: {
				type: Datatype.STRING,
			},
			step: {
				type: Datatype.UINT32,
			},
			entities: {
				type: Datatype.MAP,
				mapKeyType: Datatype.STRING,
				mapValueType: Datatype.CLASS,
			},
		};
	}
}
