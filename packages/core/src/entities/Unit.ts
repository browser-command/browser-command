import { Entity } from './Entity';

export class Unit extends Entity {
	private _health = 100;

	private _armor = 0;

	private _speed = 10;

	get health(): number {
		return this._health;
	}

	set health(value: number) {
		this._health = Math.max(0, value);
	}

	get armor(): number {
		return this._armor;
	}

	set armor(value: number) {
		this._armor = Math.max(0, value);
	}

	get speed(): number {
		return this._speed;
	}

	set speed(value: number) {
		this._speed = Math.max(0, value);
	}
}
