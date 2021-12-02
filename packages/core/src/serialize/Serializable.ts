import { Schema } from './Schema';

export interface Serializable {
	schema(): Schema;

	[key: string]: any;
}
