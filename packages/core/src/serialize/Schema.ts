import { Datatype } from './Serializer';

export interface SchemaListType {
	type: Datatype.LIST;
	listType: Datatype;
}

export interface SchemaMapType {
	type: Datatype.MAP;
	mapKeyType: Datatype;
	mapValueType: Datatype;
}

export interface SchemaPrimitive {
	type: Datatype;
}

export type SchemaType = SchemaPrimitive | SchemaListType | SchemaMapType;

export interface Schema {
	[key: string]: SchemaType;
}
