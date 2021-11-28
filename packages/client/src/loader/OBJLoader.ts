import { Loader, Object3D } from 'three';
import { OBJLoader as DefaultOBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

export class OBJLoader extends Loader {
	load(
		url: string,
		onLoad: (object: Object3D) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void
	): void {
		const mtl = url.replace(/\.obj$/i, '.mtl');
		const mtlLoader = new MTLLoader();
		mtlLoader.setPath(this.path);
		mtlLoader.setRequestHeader(this.requestHeader);
		mtlLoader.setWithCredentials(this.withCredentials);
		mtlLoader.load(
			mtl,
			(materials) => {
				materials.preload();
				const objLoader = new DefaultOBJLoader();
				objLoader.setMaterials(materials);
				objLoader.setPath(this.path);
				objLoader.setRequestHeader(this.requestHeader);
				objLoader.setWithCredentials(this.withCredentials);
				objLoader.load(url, onLoad, onProgress, onError);
			},
			onProgress,
			onError
		);
	}
}
