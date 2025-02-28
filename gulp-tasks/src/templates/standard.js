'use strict';

module.exports = (opts) => {
	const {
		exports,
		projectDir
	} = opts;

	if (!exports) {
		throw new Error('Missing required "exports" option');
	}

	const $            = require('gulp-load-plugins')();
	const babelConf    = require('../babel')(opts);
	const fs           = require('fs-extra');
	const gulp         = require('gulp');
	const Module       = require('module');
	const path         = require('path');
	const { runTests } = require('../test-runner');

	const coverageDir = path.join(projectDir, 'coverage');
	const distDir     = path.join(projectDir, 'dist');
	const docsDir     = path.join(projectDir, 'docs');

	const { parallel, series } = gulp;

	/*
	 * Inject @axway/gulp-tasks into require() search path
	 */
	const axwayGulpTasksNodeModulesPath = path.resolve(__dirname, '../../node_modules');
	const origNodeModulesPaths = Module._nodeModulePaths;
	Module._nodeModulePaths = function (from) {
		return origNodeModulesPaths.call(this, from).concat(axwayGulpTasksNodeModulesPath);
	};

	/*
	 * Clean tasks
	 */
	async function cleanCoverage() { return fs.remove(coverageDir); }
	async function cleanDist() { return fs.remove(distDir); }
	async function cleanDocs() { return fs.remove(docsDir); }
	exports.clean = parallel(cleanCoverage, cleanDist, cleanDocs);

	// get the list of node_modules to search for lint related dependencies
	const nodeModulePaths = (() => {
		const paths = [];
		let last;
		for (let cur = __dirname; cur !== last; last = cur, cur = path.dirname(cur)) {
			const p = path.join(cur, 'node_modules');
			if (fs.existsSync(p)) {
				paths.push(p);
			}
		}
		return paths;
	})();

	let patchedNodeModulePaths = false;

	/*
	 * lint tasks
	 */
	function lint(pattern, eslintFile = 'eslint.json') {
		if (!patchedNodeModulePaths) {
			const orig = Module._nodeModulePaths;
			Module._nodeModulePaths = from => Array.from(new Set([ ...orig(from), ...nodeModulePaths ]));
			patchedNodeModulePaths = true;
		}

		const baseConfig = require(path.resolve(__dirname, '..', eslintFile));

		if (!baseConfig.parserOptions) {
			baseConfig.parserOptions = {};
		}
		if (!baseConfig.parserOptions.babelOptions) {
			baseConfig.parserOptions.babelOptions = {};
		}
		baseConfig.parserOptions.babelOptions.plugins = babelConf.plugins;
		baseConfig.parserOptions.babelOptions.presets = babelConf.presets;

		// check if the user has a custom .eslintrc in the root of the project
		let custom = path.join(opts.projectDir, '.eslintrc');
		if (fs.existsSync(custom)) {
			(function merge(dest, src) {
				for (const key of Object.keys(src)) {
					if (src[key] && typeof src[key] === 'object' && !Array.isArray(src[key])) {
						if (!dest[key] || typeof dest[key] !== 'object' || Array.isArray(dest[key])) {
							dest[key] = {};
						}
						merge(dest[key], src[key]);
					} else {
						dest[key] = src[key];
					}
				}
			}(baseConfig, JSON.parse(fs.readFileSync(custom))));
		}

		return gulp.src(pattern)
			.pipe($.plumber())
			.pipe($.debug({ title: 'lint' }))
			.pipe($.eslint({ baseConfig }))
			.pipe($.eslint.format())
			.pipe($.eslint.failAfterError());
	}
	function lintSrc() { return lint('src/**/*.js'); }
	function lintTest() { return lint('test/**/test-*.js', 'eslint-tests.json'); }
	exports['lint-src'] = lintSrc;
	exports['lint-test'] = lintTest;
	exports.lint = series(
		async function lintSrcWrapper() { return lintSrc(); },
		async function lintTestWrapper() { return lintTest(); }
	);

	/*
	 * build tasks
	 */
	const build = series(
		cleanDist,
		lintSrc,
		function buildWrapper() {
			return gulp.src('src/**/*.js')
				.pipe($.plumber())
				.pipe($.debug({ title: 'build' }))
				.pipe($.sourcemaps.init())
				.pipe($.babel({
					cwd:        __dirname,
					plugins:    babelConf.plugins,
					presets:    babelConf.presets,
					sourceRoot: 'src'
				}))
				.pipe($.sourcemaps.write())
				.pipe(gulp.dest(distDir));
		}
	);
	exports.build = build;
	exports.default = build;

	exports.docs = series(cleanDocs, lintSrc, async () => {
		const esdoc = require('esdoc').default;

		esdoc.generate({
			// debug: true,
			destination: docsDir,
			plugins: [
				{
					name: 'esdoc-standard-plugin',
					option: {
						brand: {
							title:       opts.pkgJson.name,
							description: opts.pkgJson.description,
							respository: 'https://github.com/appcelerator/axway-gulp-tasks',
							site:        'https://github.com/appcelerator/axway-gulp-tasks'
						}
					}
				},
				{
					name: 'esdoc-ecmascript-proposal-plugin',
					option: {
						all: true
					}
				}
			],
			source: './src'
		});
	});

	/*
	 * test tasks
	 */
	exports.test             = series(lintTest, build,                function test() {     return runTests({ root: axwayGulpTasksNodeModulesPath, projectDir }); });
	exports['test-only']     = series(lintTest,                       function test() {     return runTests({ root: axwayGulpTasksNodeModulesPath, projectDir }); });
	exports.coverage         = series(cleanCoverage, lintTest, build, function coverage() { return runTests({ root: axwayGulpTasksNodeModulesPath, projectDir, cover: true }); });
	exports['coverage-only'] = series(cleanCoverage, lintTest,        function coverage() { return runTests({ root: axwayGulpTasksNodeModulesPath, projectDir, cover: true }); });

	/*
	 * watch tasks
	 */
	exports.watch = function watch() {
		return new Promise(resolve => {
			const watcher = gulp.watch(`${process.cwd()}/src/**/*.js`, {
				ignoreInitial: false
			}, done => {
				// this is basically a hack because if build() fails, for some reason the callback
				// is never fired, so just call done() immediately
				build();
				done();
			});
			process.on('uncaughtException', () => {});
			process.on('SIGINT', () => {
				watcher.close();
				resolve();
			});
		});
	};

	exports['watch-test'] = series(build, function watchTest() {
		return new Promise(resolve => {
			const watcher = gulp.watch([ `${process.cwd()}/src/**/*.js`, `${process.cwd()}/test/*.js` ], exports.test);
			process.on('uncaughtException', () => {});
			process.on('SIGINT', () => {
				watcher.close();
				resolve();
			});
		});
	});
};
