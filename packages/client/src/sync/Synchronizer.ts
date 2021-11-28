import type { Client } from '../Client';
import { Drift, Strategy } from './Strategy';

export class Synchronizer {
	private construct: new (...args: ConstructorParameters<typeof Strategy>) => Strategy;
	private strategy: Strategy;

	public constructor(
		private client: Client,
		strategy: new (...args: ConstructorParameters<typeof Strategy>) => Strategy
	) {
		this.construct = strategy;
		this.strategy = new strategy(client);

		this.client.on('snapshot', (snapshot) => {
			this.strategy.collect(snapshot);
		});
	}

	public update() {
		this.strategy.update();
	}

	public get drift(): Drift {
		return this.strategy.drift;
	}
}
