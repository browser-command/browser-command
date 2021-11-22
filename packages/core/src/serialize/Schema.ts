import { Datatype } from './Serializer';

export interface SchemaType {
	type: Datatype;
	listType?: Datatype;
}

export interface Schema {
	[key: string]: SchemaType;
}
