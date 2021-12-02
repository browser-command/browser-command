import { Schema, Serializable } from '../serialize';

import { Event } from './Event';

export class Payload implements Serializable {
	public events: Event[] = [];

	public schema(): Schema {
		return {
			events: {
				type: 'list',
				listType: 'class',
			},
		};
	}
}
