import { Schema, Serializable } from '../serialize';
import { Entity } from '../entities';

export class Snapshot implements Serializable {
	public type: 'full' | 'partial' = 'full';
	public step = 0;
	public entities = new Map<string, Entity>();

	public acknowledged = false;

	schema(): Schema {
		return {
			type: 'string',
			step: 'uint32',
			entities: {
				type: 'map',
				mapKeyType: 'string',
				mapValueType: 'class',
			},
		};
	}
}
