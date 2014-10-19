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
	gulp.watch(['./test/**/*.html'], ['reload']);
	gulp.watch(['./src/**/*.js'], ['reload']);
	gulp.watch(['./src/**/*.html'], ['templates']);
	gulp.watch(['./build/**/*.js'], ['reload']);
});

gulp.task('open', ['connect'], function() {
	gulp.src("./test/app/index.html").pipe(open("", {
		url: "http://localhost:3017/test/app"
	}));
});

gulp.task('inject-test-app', ['templates'], function() {
	var target = gulp.src('test/app/index-src.html');
	var sources = gulp.src([
		'test/app/app.js',
		'src/fact-client-services.js',
		'src/services/*.js',
		'src/fact-client-templates.js',
		'build/directives/**/*.html.js',
		'src/directives/**/*.js'
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

gulp.task('dist', ['templates'], function() {
	gulp.src(['src/fact-client-services.js', 'src/services/*.js']).pipe(concat('fact-client-services.js')).pipe(gulp.dest('./dist/'));
	gulp.src(['src/fact-client-templates.js', 'build/directives/**/*.html.js']).pipe(concat('fact-client-templates.js')).pipe(gulp.dest('./dist/'));
	gulp.src(['src/directives/**/*.js']).pipe(rename(function(path) {
		path.dirname = '';
	})).pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['connect', 'watch', 'open']);