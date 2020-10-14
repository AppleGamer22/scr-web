module.exports = {
	preset: "../../jest.preset.js",
	coverageDirectory: "../../coverage/apps/server",
	testEnvironment: "node",
	globals: { "ts-jest": { tsConfig: "<rootDir>/tsconfig.spec.json" } },
	displayName: "server",
};
