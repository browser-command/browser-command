import { World } from '../World';
import { Datatype, Serializable } from '../serialize';

export class Entity implements Serializable {
	private readonly _id: string;
	private readonly _type: string;

	private _model: string;

	public constructor(private readonly world: World) {
		this._id = '';
		this._type = '';
		this._model = '';
	}

	public schema() {
		return {
			_id: { type: Datatype.STRING },
			_type: { type: Datatype.STRING },
			_parent: { type: Datatype.CLASS },
			_owner: { type: Datatype.CLASS },
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

	public get model(): string {
		return this._model;
	}

	public set model(model: string) {
		this._model = model;
	}
}
