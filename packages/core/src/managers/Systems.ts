import { System } from '../systems';
import { Register } from '../collections';
import { World } from '../world';

export class Systems extends Register<System, World> {}
