module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRegex: '/test/.*\\.test\\.[jt]s$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.json',
		},
	},
	collectCoverageFrom: ['src/**/*.{js,ts}', '!<rootDir>/node_modules/'],
};
