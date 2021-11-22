import { World } from '../World';

export class Entity {
	public static NULL = Object.create(Entity.prototype);

	private readonly _id: string;
	private readonly _type: string;

	private _parent: Entity;
	private _owner: Entity;

	private _model: string;

	public constructor(private readonly world: World) {
		this._id = '';
		this._type = '';
		this._parent = Entity.NULL;
		this._owner = Entity.NULL;
		this._model = '';
	}

	public spawn(): void {}

	public initialize(): void {
		return;
	}

	public update(dt: number): void {
		return;
	}

	/**
	 * @note Subclasses which override this method must call super.destroy()
	 */
	public destroy(): void {}

	public get valid(): boolean {
		return this._id !== '';
	}

	public get id(): string {
		return this._id;
	}

	public get type(): string {
		return this._type;
	}

	public get parent(): Entity {
		return this._parent;
	}

	public set parent(parent: Entity) {
		if (!parent.valid) {
			throw new Error(`Invalid parent entity: '${parent.id}'`);
		}

		this._parent = parent;
	}

	public get owner(): Entity {
		return this._owner;
	}

	public set owner(owner: Entity) {
		if (!owner.valid) {
			throw new Error(`Invalid owner entity: '${owner.id}'`);
		}

		this._owner = owner;
	}

	public get model(): string {
		return this._model;
	}

	public set model(model: string) {
		this._model = model;
	}
}
