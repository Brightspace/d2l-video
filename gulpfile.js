/* eslint-env node */
/* eslint-disable no-console */

'use strict';

const del = require('del');
const gulp = require('gulp');
const ejs = require('gulp-ejs');
const mergeStream = require('merge-stream');

const rename = require('gulp-rename');
const requireDir = require('require-dir');
const buildDirectory = 'build';
const localeResources = requireDir('locales/json');

const config = {
	dest: buildDirectory,
	localeFiles: Object.keys(localeResources).map((lang) => ({
		filename: lang,
		data: {
			lang,
			properLang: lang.charAt(0).toUpperCase() + lang.slice(1).replace('-', ''),
			resources: JSON.stringify(localeResources[lang], null, '\t'),
			comment: 'This file is auto-generated. Do not modify.'
		}
	}))
};

function createLocalizationFiles() {
	const options = {
		client: true,
		strict: true,
		root: 'locales',
		localsName: 'data'
	};

	console.log('Creating localization files...');

	return mergeStream(config.localeFiles.map(({ filename, data }) =>
		gulp.src('./locales/lang-behavior.ejs')
			.pipe(ejs(data, options))
			.pipe(rename({
				basename: filename,
				extname: '.js'
			}))
			.pipe(gulp.dest(options.root)))
	);
}

gulp.task('delete-locales', () => del(['locales/*.js']));
gulp.task('localize', gulp.series('delete-locales', createLocalizationFiles));
