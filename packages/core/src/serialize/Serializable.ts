import { Schema } from './Schema';

export interface Serializable {
	typeid?: number;

	schema(): Schema;

	[key: string]: any;
}
