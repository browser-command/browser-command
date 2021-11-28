import {
	AmbientLight,
	Camera,
	Color,
	GridHelper,
	LoadingManager,
	Material,
	Object3D,
	ObjectLoader,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three';

import { OBJLoader } from '../loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Entity, Engine } from '@browser-command/core';

import { Renderer } from './Renderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
	private readonly controls: OrbitControls;

	private manager = new LoadingManager();
	private loaders = new Map<string, Loader>();
	private cache = new Map<string, any>();

	private entities: Map<Entity, Object3D> = new Map();
	private models: Map<Entity, string> = new Map();

	public constructor(engine: Engine) {
		super(engine);

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		const viewport = document.getElementById('viewport');

		if (!viewport) {
			throw new Error('Viewport not found');
		}

		viewport.append(this.renderer.domElement);

		this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 100, 0);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.minDistance = 40;
		this.controls.maxDistance = 1000;
		this.controls.target.set(0, 0, 0);
		this.controls.update();

		this.scene.add(this.camera);
		this.scene.background = new Color(0x595959);

		const light = new AmbientLight(0x404040);
		this.scene.add(light);

		const grid = new GridHelper(500, 10, 0xffffff, 0xffffff);
		const material = grid.material as Material;
		material.opacity = 0.5;
		material.depthWrite = false;
		material.transparent = true;
		this.scene.add(grid);

		this.loaders.set('obj', new OBJLoader(this.manager));
		this.loaders.set('gltf', new GLTFLoader(this.manager));
		this.loaders.set('json', new ObjectLoader(this.manager));

		this.engine.on('entity:create', (entity: Entity) => this.add(entity));
		this.engine.on('entity:destroy', (entity: Entity) => this.remove(entity));
	}

	add(entity: Entity) {
		console.log(`Adding entity ${entity.id} to renderer`);

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
		this.controls.update();

		this.renderer.render(this.scene, this.camera);

		for (const [entity, object3d] of this.entities) {
			if (this.models.get(entity) !== entity.model) {
				this.models.set(entity, entity.model);

				if (entity.model) {
					this.loadModel(entity, entity.model);
				}
			}

			object3d.position.set(entity.position.x, entity.position.y, entity.position.z);

			entity.draw();
		}

		super.update();
	}

	private loadModel(entity: Entity, model: string) {
		console.log(`Loading model ${model}`);

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
			loader.load(
				model,
				(object) => {
					if (this.entities.has(entity)) {
						this.scene.remove(this.entities.get(entity) as Object3D);
					}

					const object3D = 'scene' in object ? object.scene : object;

					this.scene.add(object3D);
					this.entities.set(entity, object3D);
					this.cache.set(model, object3D);
				},
				undefined,
				(error) => {
					console.error(error);
				}
			);
		}
	}
}
