import path from 'path';
import { defineConfig } from 'vite'
import typescript from '@rollup/plugin-typescript'

const resolvePath = (str) => path.resolve(__dirname, str)

export default defineConfig({
	build: {
		lib: {
			entry: resolvePath('src/index.ts'),
			name: '@browser-command/core',
			fileName: (format) => `browser-command.${format}.js`,
		},
		rollupOptions: {
			plugins: [
				typescript({
					tsconfig: resolvePath('tsconfig.json'),
					declaration: true,
          declarationDir: resolvePath('dist/'),
				}),
			]
		},
	},
})
