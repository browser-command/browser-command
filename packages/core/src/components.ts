import { defineComponent, Types } from 'bitecs';

export const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };
export const Quaternion = { x: Types.f32, y: Types.f32, z: Types.f32, w: Types.f32 };

export const Position = defineComponent(Vector3);
export const Rotation = defineComponent(Quaternion);
