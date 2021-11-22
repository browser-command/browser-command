import { Datatype, Schema, Serializable } from '../serialize';

import type { Event } from './Event';

export class Payload implements Serializable {
	public events: Event[] = [];

	schema(): Schema {
		return {
			events: {
				type: Datatype.LIST,
				listType: Datatype.CLASS,
			},
		};
	}
}
