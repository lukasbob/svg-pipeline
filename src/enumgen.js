'use strict';
const path = require('path'),
	promise = require('promise'),
	pascalCase = require('pascal-case'),
	through = require('through2'),
	File = require('vinyl'),
	hb = require('handlebars'),
	gutil = require('gulp-util'),
	readFile = promise.denodeify(require('fs').readFile);

function enumGen(options) {
	const files = [];

	// Capture all file paths
	const mapper = (file, _, cb) => {
		files.push(file.path);
		cb();
	};

	// Reduce file paths to output files.
	const reducer = function(cb) {
		const stream = this;

		// Model to pass to the handlebars templates.
		const model = {
			items: files.map(x => {
				const base = path.basename(x, '.svg');
				return {
					path: x,
					base: base,
					name: pascalCase(base)
				};
			})
		};

		// Error handle for file reads.
		const errHandler = err => { cb(err, null); };

		// Generates stream output by applying model to handlebars template functions
		const generate = fp => src => {
			const tpl = hb.compile(src);
			const dest = path.join(options.dest, path.basename(fp));

			gutil.log('Generating', `'${gutil.colors.cyan(dest)}'`);

			stream.push(new File({
				path: dest,
				contents: new Buffer(tpl(model))
			}));
		};

		// Map template list to a list of file read promises.
		const promises = options.templates.map(fp => readFile(fp, 'utf-8')
			.then(generate(fp))
			.catch(errHandler));

		// Resolve all file read promises and call back.
		promise.all(promises).nodeify(() => cb());
	};

	return through.obj(mapper, reducer);
}

module.exports = enumGen;
