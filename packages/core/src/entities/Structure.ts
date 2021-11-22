import { Entity } from './Entity';

export class Structure extends Entity {
	private _health = 100;

	update(dt: number): void {}

	get health(): number {
		return this._health;
	}

	set health(value: number) {
		this._health = value;
	}
}
