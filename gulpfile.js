/*global require*/

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var angularTemplates = require('gulp-angular-templates');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var inject = require('gulp-inject');

gulp.task('connect', ['templates', 'inject-test-app'], function() {
	connect.server({
		port: '3017',
		root: '.',
		livereload: true
	});
});

gulp.task('reload', function() {
	gulp.src('./test/**/*.html').pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(['./test/app/index-src.html'], ['inject-test-app']);
	gulp.watch(['./test/**/*', '!./test/app/index-src.html'], ['reload']);
	gulp.watch(['./src/**/*.js'], ['reload']);
	gulp.watch(['./src/**/*.css'], ['reload']);
	gulp.watch(['./src/**/*.html'], ['templates']);
	gulp.watch(['./build/**/*.js'], ['reload']);
});

gulp.task('open', ['connect'], function() {
	gulp.src('./test/app/index.html').pipe(open('', {
		url: 'http://localhost:3017/test/app'
	}));

	gulp.src('./demos/basic/index.html').pipe(open('', {
		url: 'http://localhost:3017/demos/basic'
	}));
});

gulp.task('inject-test-app', ['templates'], function() {
	var target = gulp.src('test/app/index-src.html');
	var sources = gulp.src([
		'test/app/app.js',
		'test/data/*.js',
		'src/**/*.js',
		'build/directives/**/*.html.js',
		'src/**/*.css',
	], {
		read: false
	});

	return target.pipe(inject(sources))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('test/app'));
});

gulp.task('templates', function() {
	return gulp.src('src/**/*.html')
		.pipe(angularTemplates({
			module: 'fact-client.templates'
		}))
		.pipe(gulp.dest('./build/'));
});

gulp.task('styles', function() {
	gulp.src(['src/**/*.css']).pipe(concat('fact-client.css')).pipe(gulp.dest('./dist/'));
});

gulp.task('dist', ['templates', 'styles'], function() {
	gulp.src(['src/**/*.js', 'build/directives/**/*.html.js']).pipe(concat('fact-client.js')).pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['connect', 'watch', 'open']);