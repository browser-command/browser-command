import path from 'path';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';

const resolvePath = (str) => path.resolve(__dirname, str);

export default defineConfig({
	build: {
		lib: {
			entry: resolvePath('src/index.ts'),
			name: '@browser-command/player',
			fileName: (format) => `browser-command.client.${format}.js`,
		},
		rollupOptions: {
			plugins: [
				typescript({
					tsconfig: resolvePath('tsconfig.json'),
					outDir: resolvePath('lib'),
					declarationDir: resolvePath('lib'),
					declaration: true,
				}),
			],
			output: {
				dir: resolvePath('lib'),
			},
		},
	},
});
