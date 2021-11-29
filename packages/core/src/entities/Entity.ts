import { World } from '../world';
import { Datatype, Serializable } from '../serialize';
import { Vector3, Quaternion } from '../math';

export class Entity implements Serializable {
	private _id = '';
	private _type = '';

	private _position: Vector3 = new Vector3();
	private _quaternion: Quaternion = new Quaternion();

	private _model = '';

	private _initialized = false;
	private _destroyed = false;

	public constructor(protected readonly world: World) {}

	public schema() {
		return {
			id: { type: Datatype.STRING },
			type: { type: Datatype.STRING },
			model: { type: Datatype.STRING },
			position: { type: Datatype.CLASS },
			quaternion: { type: Datatype.CLASS },
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

	public set position(value: { x: number; y: number; z: number }) {
		this._position.x = value.x;
		this._position.y = value.y;
		this._position.z = value.z;
	}

	public get quaternion(): Quaternion {
		return this._quaternion;
	}

	public set quaternion(value: { x: number; y: number; z: number; w: number }) {
		this._quaternion.x = value.x;
		this._quaternion.y = value.y;
		this._quaternion.z = value.z;
		this._quaternion.w = value.w;
	}

	public get model(): string {
		return this._model;
	}

	public set model(model: string) {
		this._model = model;
	}
}
