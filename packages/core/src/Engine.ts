import { EventEmitter2 } from 'eventemitter2';

import { World } from './world';
import { Network } from './network';
import { Datatype, Serializer } from './serialize';
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

	public entities: Register<string, typeof Entity>;

	protected serializer = new Serializer();
	protected network = new Network(this.serializer);

	protected constructor() {
		super({
			wildcard: true,
			delimiter: ':',
			maxListeners: 1000,
		});

		this.world = new World();
		this.entities = new Register<string, typeof Entity>('entity');

		const isServer = typeof window === 'undefined';
		const globals = isServer ? global : window;

		(globals as Record<string, unknown>)['GAME'] = this;

		this.isServer = isServer;
	}

	public initialize(): void {
		this.entities.on('create', (entity: Entity) => {
			Object.assign(entity, {
				_id: Engine.generateUUID(),
				world: this.world,
			});
			this.world.entities.set(entity.id, entity);
		});

		this.entities.register('unit', (world) => new Unit(world));

		this.serializer.register('entity', Entity);
		this.serializer.register('unit', Unit);

		this.network.register('test', {
			foo: { type: Datatype.STRING },
			bar: { type: Datatype.FLOAT32 },
			baz: { type: Datatype.CLASS },
		});
	}

	public update() {
		return;
	}

	public start(): void {
		this.initialize();
		this.emit('engine:initialize');

		const loop = new GameLoop({
			fps: 1,
			tps: 1,
			callback: () => {
				this.emit('engine:update:begin');
				this.update();
				this.emit('engine:update:end');
			},
		});

		loop.start();
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
