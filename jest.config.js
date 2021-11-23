module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {},
	},
	projects: ['<rootDir>/packages/*'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
};
