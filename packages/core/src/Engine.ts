import { EventEmitter2 } from 'eventemitter2';
import { Quaternion, Vector3 } from 'three';

import { World } from './world';
import { Network } from './network';
import { Serializer } from './serialize';
import { GameLoop } from './GameLoop';
import { Entity, Unit } from './entities';
import { Register } from './collections';

const _lut: string[] = [];

for (let i = 0; i < 256; i++) {
	_lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

export abstract class Engine extends EventEmitter2 {
	public readonly isServer: boolean;
	public world: World;

	protected entities = new Register<string, typeof Entity>('entity');
	protected serializer = new Serializer();
	protected network = new Network(this.serializer);

	protected constructor() {
		super({
			wildcard: true,
			delimiter: ':',
			maxListeners: 1000,
		});

		this.world = new World();

		const isServer = typeof window === 'undefined';
		const globals = isServer ? global : window;

		(globals as Record<string, unknown>)['GAME'] = this;

		this.isServer = isServer;
	}

	public initialize(): void {
		this.serializer.register('vector', Vector3);
		this.serializer.register('quaternion', Quaternion);

		this.register('entity', Entity);
		this.register('unit', Unit);
	}

	public register(name: string, type: typeof Entity): void {
		this.entities.register(name, type);
		this.serializer.register(name, type);
	}

	public create(name: string): Entity {
		const entity = this.entities.create(name, this.world);
		Object.assign(entity, {
			_id: Engine.generateUUID(),
			world: this.world,
		});
		this.emit('entity:create', entity);
		return entity;
	}

	public update() {
		return;
	}

	public start(): void {
		this.initialize();
		this.emit('initialize');
	}

	private static generateUUID() {
		const d0 = (Math.random() * 0xffffffff) | 0;
		const d1 = (Math.random() * 0xffffffff) | 0;
		const d2 = (Math.random() * 0xffffffff) | 0;
		const d3 = (Math.random() * 0xffffffff) | 0;
		const uuid =
			_lut[d0 & 0xff] +
			_lut[(d0 >> 8) & 0xff] +
			_lut[(d0 >> 16) & 0xff] +
			_lut[(d0 >> 24) & 0xff] +
			'-' +
			_lut[d1 & 0xff] +
			_lut[(d1 >> 8) & 0xff] +
			'-' +
			_lut[((d1 >> 16) & 0x0f) | 0x40] +
			_lut[(d1 >> 24) & 0xff] +
			'-' +
			_lut[(d2 & 0x3f) | 0x80] +
			_lut[(d2 >> 8) & 0xff] +
			'-' +
			_lut[(d2 >> 16) & 0xff] +
			_lut[(d2 >> 24) & 0xff] +
			_lut[d3 & 0xff] +
			_lut[(d3 >> 8) & 0xff] +
			_lut[(d3 >> 16) & 0xff] +
			_lut[(d3 >> 24) & 0xff];

		// .toUpperCase() here flattens concatenated strings to save heap memory space.
		return uuid.toUpperCase();
	}
}
