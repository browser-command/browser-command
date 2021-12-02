import { Datatype } from './Serializer';

export interface SchemaPrimitive {
	type: Datatype;
}

export interface SchemaListType extends SchemaPrimitive {
	type: 'list';
	listType: SchemaType | Datatype;
}

export interface SchemaMapType extends SchemaPrimitive {
	type: 'map';
	mapKeyType: Datatype;
	mapValueType: SchemaType | Datatype;
}

export type SchemaType = SchemaPrimitive | SchemaListType | SchemaMapType;

export interface Schema {
	[key: string]: Datatype | SchemaType;
}
