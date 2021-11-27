import { Datatype, Serializable } from '../serialize';

import { Event } from './Event';

export class Payload implements Serializable {
	public events: Event[] = [];

	public schema() {
		return {
			events: {
				type: Datatype.LIST,
				listType: Datatype.CLASS,
			},
		};
	}
}
