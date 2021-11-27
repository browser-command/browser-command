import {
	Camera,
	Color,
	LoadingManager,
	Object3D,
	ObjectLoader,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Entity, Engine } from '@browser-command/core';

import { Renderer } from './Renderer';

interface Loader {
	load: (
		url: string,
		onLoad: (object: any) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: Error | ErrorEvent) => void
	) => void;
}

export class ThreeRenderer extends Renderer {
	private scene: Scene = new Scene();
	private renderer = new WebGLRenderer({ antialias: true });
	private readonly camera: Camera;

	private manager = new LoadingManager();
	private loaders = new Map<string, Loader>();
	private cache = new Map<string, any>();

	private entities: Map<Entity, Object3D> = new Map();
	private models: Map<Entity, string> = new Map();

	public constructor(engine: Engine) {
		super(engine);

		this.renderer.setPixelRatio(window.devicePixelRatio);

		const viewport = document.getElementById('#viewport');

		if (!viewport) {
			throw new Error('Viewport not found');
		}

		viewport.append(this.renderer.domElement);

		this.camera = new PerspectiveCamera();

		this.scene.add(this.camera);
		this.scene.background = new Color(0xff0000);

		this.loaders.set('obj', new OBJLoader(this.manager));
		this.loaders.set('gltf', new GLTFLoader(this.manager));
		this.loaders.set('json', new ObjectLoader(this.manager));

		this.engine.on('entity:create', (entity: Entity) => this.add(entity));
		this.engine.on('entity:destroy', (entity: Entity) => this.remove(entity));
	}

	add(entity: Entity) {
		if (this.entities.has(entity)) {
			return;
		}

		const object3D = new Object3D();
		this.scene.add(object3D);
		this.entities.set(entity, object3D);
	}

	remove(entity: Entity): void {
		if (!this.entities.has(entity)) {
			return;
		}

		const object3D = this.entities.get(entity);
		this.scene.remove(object3D as Object3D);
		this.entities.delete(entity);
	}

	update() {
		for (const [entity] of this.entities) {
			if (this.models.get(entity) !== entity.model) {
				this.models.set(entity, entity.model);
				this.loadModel(entity, entity.model);
			}
		}

		this.renderer.render(this.scene, this.camera);

		super.update();
	}

	private loadModel(entity: Entity, model: string) {
		const loader = this.loaders.get(model.split('.').pop() as string);
		if (!loader) {
			throw new Error(`Loader for ${model} not found`);
		}

		if (this.cache.has(model)) {
			if (this.entities.has(entity)) {
				this.scene.remove(this.entities.get(entity) as Object3D);
				this.scene.add(this.cache.get(model) as Object3D);
			}
		} else {
			loader.load(model, (object) => {
				if (this.entities.has(entity)) {
					this.scene.remove(this.entities.get(entity) as Object3D);
				}

				const object3D = 'scene' in object ? object.scene : object;

				this.scene.add(object3D);
				this.entities.set(entity, object3D);
				this.cache.set(model, object3D);
			});
		}
	}
}
