import { EventEmitter2 } from 'eventemitter2';

const time =
	typeof performance !== 'undefined'
		? () => performance.now()
		: () => {
				const time = process.hrtime();
				return time[0] * 1000 + time[1] / 1000000;
		  };

export type GameLoopOptions = {
	tps: number;
	frame: (delta: number) => void;
	tick: (delta: number) => void;
};

export class GameLoop extends EventEmitter2 {
	private next = 0;
	private last = 0;
	private stall = 0;
	private delay = 0;

	private delta = 0;

	public options: GameLoopOptions;

	public constructor(options: Partial<GameLoopOptions> = {}) {
		super({
			wildcard: true,
			delimiter: ':',
			maxListeners: 100,
		});

		this.options = {
			tps: 20,
			frame: () => {
				return;
			},
			tick: () => {
				return;
			},
			...options,
		};

		this.options.tps = 1000 / Math.max(1, this.options.tps);
	}

	public start(): void {
		this.last = time();
		setTimeout(() => this.tick());

		if (typeof window !== 'undefined') {
			window.requestAnimationFrame(() => this.frame());
		}
	}

	public tick(): void {
		const now = time();
		if (now > this.next + this.options.tps * 0.3) {
			this.stall++;
		} else {
			this.stall = 0;
		}

		this.callback(now - this.last);
		this.last = now;
		this.next = now + this.options.tps + this.delay;
		this.delay = 0;
		setTimeout(() => this.tick(), this.next - time());
	}

	private callback(delta: number): void {
		if (this.stall > 10) {
			this.emit('stalled');
			this.stall = 0;
		}

		this.options.tick(delta);
	}

	private frame(): void {
		const now = time();
		this.options.frame(this.delta);
		this.delta = time() - now;

		if (typeof window !== 'undefined') {
			window.requestAnimationFrame(() => this.frame());
		}
	}
}
