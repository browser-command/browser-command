import { World } from '../world';
import { Datatype, Serializable } from '../serialize';
import { Quaternion, Vector3 } from '../types';

export class Entity implements Serializable {
	private _id = '';
	private _type = '';

	private _position: Vector3 = { x: 0, y: 0, z: 0 };
	private _rotation: Quaternion = { x: 0, y: 0, z: 0, w: 1 };

	private _model = '';

	private _initialized = false;
	private _destroyed = false;

	public constructor(protected readonly world: World) {}

	public schema() {
		return {
			id: { type: Datatype.STRING },
			type: { type: Datatype.STRING },
			model: { type: Datatype.STRING },
		};
	}

	/**
	 * Initializes the entity and adds it to the world.
	 */
	public spawn(): void {
		if (this._initialized) return;

		this.initialize();

		this.world.add(this);
	}

	public initialize(): void {
		return;
	}

	public draw(): void {
		return;
	}

	public update(dt: number): void {
		return;
	}

	/**
	 * @note Subclasses which override this method must call super.destroy()
	 */
	public destroy(): void {
		this._destroyed = true;

		this.world.remove(this);
	}

	public get valid(): boolean {
		return this._initialized && !this._destroyed && this._id !== '';
	}

	public get id(): string {
		return this._id;
	}

	private set id(id: string) {
		this._id = id;
	}

	public get type(): string {
		return this._type;
	}

	private set type(type: string) {
		this._type = type;
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
