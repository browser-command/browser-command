import { World } from '../world';
import { Datatype, Serializable } from '../serialize';
import { Quaternion, Vector3 } from '../types';

export class Entity implements Serializable {
	private readonly _id: string;
	private readonly _type: string;

	private _position: Vector3 = { x: 0, y: 0, z: 0 };
	private _rotation: Quaternion = { x: 0, y: 0, z: 0, w: 1 };

	private _model: string;

	public constructor(protected readonly world: World) {
		this._id = '';
		this._type = '';
		this._model = '';
	}

	public schema() {
		return {
			_id: { type: Datatype.STRING },
			_type: { type: Datatype.STRING },
			_model: { type: Datatype.STRING },
		};
	}

	public spawn(): void {
		return;
	}

	public initialize(): void {
		return;
	}

	public update(dt: number): void {
		return;
	}

	/**
	 * @note Subclasses which override this method must call super.destroy()
	 */
	public destroy(): void {
		return;
	}

	public get valid(): boolean {
		return this._id !== '';
	}

	public get id(): string {
		return this._id;
	}

	public get type(): string {
		return this._type;
	}

	public get position(): Vector3 {
		return this._position;
	}

	public set position(value: Vector3) {
		this._position.x = value.x;
		this._position.y = value.y;
		this._position.z = value.z;
	}

	public get rotation(): Quaternion {
		return this._rotation;
	}

	public set rotation(value: Quaternion) {
		this._rotation.x = value.x;
		this._rotation.y = value.y;
		this._rotation.z = value.z;
		this._rotation.w = value.w;
	}

	public get model(): string {
		return this._model;
	}

	public set model(model: string) {
		this._model = model;
	}
}
