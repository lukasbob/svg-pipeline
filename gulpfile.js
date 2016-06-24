'use strict';
const gulp = require('gulp'),
	del = require('del'),
	svgSprite = require('gulp-svg-sprite'),
	enumGen = require('./src/enumgen.js'),

	// Configuration for sprite sheet creation
	spriteConfig = {
		shape: {
			dimension: { // Set maximum dimensions
				maxWidth: 32,
				maxHeight: 32
			},
			spacing: { // Add padding
				padding: 5
			},
			dest: 'out/intermediate-svg' // Keep the intermediate files
		},
		mode: {
			inline: { example: true },
			symbol: { example: true },
			css: { example: true },
			view: { // Activate the «view» mode
				bust: false,
				render: {
					css: true // Activate Css output (with default options)
				},
				example: true
			}
		}
	},

	// Configuration for C# enum generation
	enumConfig = {
		cwd: './src/templates',
		dest: './enums', // TODO: individual template needs separate output paths
		templates: ['./src/templates/sprite.handlebars.cs', './src/templates/sprite.handlebars.css']
	};

// Task defintions
gulp.task('svg', () => {
	let assets = gulp.src('**/*.svg', { cwd: './assets' });
	let destFn = gulp.dest('out');

	// Generate enums based on svg collection
	assets.pipe(enumGen(enumConfig))
		.pipe(destFn);

	// Generate sprites based on svg collection
	assets.pipe(svgSprite(spriteConfig))
		.pipe(destFn)
	});

gulp.task('default', ['svg']);
gulp.task('clean', () => del(['out']));
