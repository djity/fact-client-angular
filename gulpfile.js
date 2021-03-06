/*global require*/
/*jshint node:true*/

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var angularTemplates = require('gulp-angular-templates');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var deploy = require('gulp-gh-pages');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var minifyCss = require('gulp-minify-css');
var clean = require('gulp-clean');
var exec = require('child_process').exec;

/*****************************************************
 * Clean build directory (contains all generated files)
 ******************************************************/

gulp.task('clean', function() {
	return gulp.src('build', {
			read: false
		})
		.pipe(clean());
});

/*************************************
 * Development server and webapps build
 **************************************/

gulp.task('default', ['connect', 'watch', 'open']);

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
		'build/templates/**/*.html.js',
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
		.pipe(gulp.dest('./build/templates'));
});

/*****************************************
 * Prepare dist folder for bower publishing
 ******************************************/

gulp.task('dist', ['dist-styles', 'dist-sources']);

gulp.task('dist-styles', function() {
	return gulp.src(['src/**/*.css']).pipe(concat('fact-client.css')).pipe(gulp.dest('./build/dist/'));
});

gulp.task('dist-sources', ['templates'], function() {
	return gulp.src(['src/**/*.js', 'build/templates/**/*.html.js']).pipe(concat('fact-client.js')).pipe(gulp.dest('./build/dist/'));
});

/*********************************************
 * deploy to gh-pages and bower dedicated repo
 *********************************************/

// Build the demos before pushing to gh-pages
gulp.task('usemin-demos', ['dist'], function() {
	return gulp.src('./demos/**/*.html')
		.pipe(usemin({
			css: [minifyCss(), rev()],
			js: [uglify(), rev()]
		}))
		.pipe(gulp.dest('build/demos'));
});

gulp.task('git-config', function(callback){
	exec('git config --global user.email "alban.mouton@gmail.com" && git config --global user.name "Alban Mouton through Travis-CI"', callback);
});

// Deploy demos applications, can be be called manually or by travis-ci by including '[deploy demos]' in a commit message
gulp.task('deploy-gh-pages', ['usemin-demos', 'git-config'], function() {
	var ciMsg = process.env.TRAVIS_COMMIT_MSG;
	if (ciMsg && ciMsg.indexOf('[deploy demos]') === -1 && ciMsg.indexOf('[deploy-demos]') === -1) {
		return console.log('No [deploy demos] string found in commit message. Do not deploy to gh-pages.');
	}
	var deployOptions = {
		cacheDir: './build/repos/fact-client-angular'
	};
	if (process.env.githubToken) {
		console.log('"githubToken" environment variable found, use it to authenticate to github');
		deployOptions.remoteUrl = 'https://' + process.env.githubToken + '@github.com/djity/fact-client-angular';
	}
	return gulp.src('./build/demos/**/*')
		.pipe(deploy(deployOptions));
});

// Deploy to the bower dedicated repository. Only done by travis-ci when the repo is tagged
gulp.task('deploy-bower', ['dist', 'git-config'], function() {
	if (!process.env.TRAVIS_TAG) {
		return console.log('No tag detected. Do not deploy to bower.');
	}

	var deployOptions = {
		branch: 'master',
		cacheDir: './build/repos/fact-client-angular-bower'
	};

	if (process.env.githubToken) {
		console.log('"githubToken" environment variable found, use it to authenticate to github');
		deployOptions.remoteUrl = 'https://' + process.env.githubToken + '@github.com/djity/fact-client-angular-bower';
	} else {
		deployOptions.remoteUrl = 'https://github.com/djity/fact-client-angular-bower';
	}
	return gulp.src('./build/dist/**/*')
		.pipe(deploy(deployOptions))
		.on('end', function() {
			console.log('tag the bower repository');
			exec('cd ./build/repos/fact-client-angular-bower && git tag -a -m "' + process.env.TRAVIS_TAG + '" ' + process.env.TRAVIS_TAG);
		});
});
