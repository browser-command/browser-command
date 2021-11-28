import { Client } from '../Client';
import { RingBuffer, Snapshot } from '@browser-command/core';

export type Drift = {
	/**
	 * The maximum amount of time that the client can be behind the server.
	 */
	max: number;
	/**
	 * The maximum lead and lag thresholds at which the client can drift.
	 */
	thresholds: {
		[key: string]: { lead: number; lag: number };
	};
};

export abstract class Strategy {
	protected initialized = false;
	protected snapshots: RingBuffer<Snapshot>;

	public constructor(protected readonly client: Client) {
		this.snapshots = new RingBuffer(30);
	}

	public collect(snapshot: Snapshot) {
		const previous = this.snapshots.get();

		if (!this.initialized) {
			if (snapshot.type !== 'full') {
				return;
			}
		} else {
			if (previous && previous.step > snapshot.step) {
				return;
			}
		}

		this.snapshots.push(snapshot);
	}

	public update() {
		const previous = this.snapshots.get();

		if (previous) {
			const applied = this.apply(previous);

			if (applied) {
				this.snapshots.pop();
			}
		}
	}

	public get drift(): Drift {
		return {
			max: 20,
			thresholds: {
				sync: { lead: 1, lag: 3 },
				step: { lead: 7, lag: 8 },
			},
		};
	}

	public abstract apply(snapshot: Snapshot): boolean;
}
