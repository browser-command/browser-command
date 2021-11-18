import { Entity } from '../entities';
import { Register } from '../collections';
import { World } from '../world';

export class Entities extends Register<Entity, World> {}
